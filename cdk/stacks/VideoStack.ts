import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';

export class VideoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // VPC for LiveKit (public and private subnets)
    const vpc = new ec2.Vpc(this, 'LiveKitVPC', {
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public-subnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'private-subnet',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    // Security Group for Internal TURN and LiveKit Communication
    const internalSg = new ec2.SecurityGroup(this, 'LiveKitSG', {
      vpc,
      description: 'Internal-only SG for LiveKit and TURN',
      allowAllOutbound: true,
    });

    // Allow internal traffic between LiveKit and TURN
    internalSg.addIngressRule(internalSg, ec2.Port.tcp(3478), 'TURN STUN (UDP)');
    internalSg.addIngressRule(internalSg, ec2.Port.tcp(5349), 'TURN TLS (TCP)');
    internalSg.addIngressRule(internalSg, ec2.Port.udpRange(50000, 60000), 'Media (UDP)');

    const livekitUserData = ec2.UserData.forLinux();
    livekitUserData.addCommands(
      'yum update -y',
      'amazon-linux-extras enable docker',
      'yum install -y docker',
      'service docker start',
      'usermod -a -G docker ec2-user',
      'chkconfig docker on',
      'curl -L https://github.com/livekit/livekit/releases/latest/download/livekit-server-linux -o /usr/local/bin/livekit-server',
      'chmod +x /usr/local/bin/livekit-server',
      'mkdir -p /etc/livekit',
      'echo \'api_keys:\n  - key: devkey\n    secret: devsecret\nkeys:\n  file: /etc/livekit/keys.yaml\' > /etc/livekit/config.yaml',
      'nohup livekit-server --config /etc/livekit/config.yaml > /var/log/livekit.log 2>&1 &'
    );

    // EC2 Instance for LiveKit Server
    const livekitInstance = new ec2.Instance(this, 'LiveKitServer', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroup: internalSg,
      keyPair: ec2.KeyPair.fromKeyPairName(this, 'LiveKitKeyPair', 'oneonone-mvp-key'),
      userData: livekitUserData,
    });

    // Elastic IP for LiveKit
    const livekitEip = new ec2.CfnEIP(this, 'LiveKitEIP');
    new ec2.CfnEIPAssociation(this, 'LiveKitEIPAssoc', {
      allocationId: livekitEip.attrAllocationId,
      instanceId: livekitInstance.instanceId,
    });

    const coturnUserData = ec2.UserData.forLinux();
    coturnUserData.addCommands(
      'yum update -y',
      'yum install -y coturn',
      'echo "\n\
    listening-port=3478\n\
    tls-listening-port=5349\n\
    listening-ip=0.0.0.0\n\
    relay-ip=0.0.0.0\n\
    fingerprint\n\
    lt-cred-mech\n\
    use-auth-secret\n\
    static-auth-secret=turnsecret\n\
    realm=livekit-app\n\
    total-quota=100\n\
    bps-capacity=0\n\
    stale-nonce\n\
    cert=/etc/ssl/certs/ssl-cert-snakeoil.pem\n\
    pkey=/etc/ssl/private/ssl-cert-snakeoil.key\n\
    no-loopback-peers\n\
    no-multicast-peers\n\
    " > /etc/turnserver.conf',
      'systemctl enable coturn',
      'systemctl start coturn'
    );

    // EC2 Instance for TURN (Coturn)
    const turnInstance = new ec2.Instance(this, 'TurnServer', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroup: internalSg,
      keyPair: ec2.KeyPair.fromKeyPairName(this, 'TurnKeyPair', 'oneonone-mvp-key'),
      userData: coturnUserData,
    });

    // Elastic IP for TURN
    const turnEip = new ec2.CfnEIP(this, 'TurnEIP');
    new ec2.CfnEIPAssociation(this, 'TurnEIPAssoc', {
      allocationId: turnEip.attrAllocationId,
      instanceId: turnInstance.instanceId,
    });

    new cdk.CfnOutput(this, 'LiveKitPublicIP', {
      value: livekitEip.ref,
    });

    new cdk.CfnOutput(this, 'TurnServerPublicIP', {
      value: turnEip.ref,
    });
  }
}

