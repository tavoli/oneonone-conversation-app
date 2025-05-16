import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

interface LambdaStackProps extends StackProps {
  usersTable: dynamodb.ITable;
  sessionsTable: dynamodb.ITable;
}

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const { usersTable, sessionsTable } = props;

    // SNS FIFO Topic
    const matchmakingTopic = new sns.Topic(this, 'MatchmakingTopic', {
      topicName: 'matchmaking.fifo',
      fifo: true,
      contentBasedDeduplication: true,
    });

    // SQS FIFO Queue
    const matchmakingQueue = new sqs.Queue(this, 'MatchmakingQueue', {
      queueName: 'matchmaking-queue.fifo',
      fifo: true,
      contentBasedDeduplication: true,
    });

    // SNS → SQS subscription
    matchmakingTopic.addSubscription(
      new subscriptions.SqsSubscription(matchmakingQueue)
    );

    // Example Lambda (enqueueUserToQueue)
    const enqueueLambda = new lambda.Function(this, 'EnqueueLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('dist/lambda/enqueue'),
      environment: {
        TOPIC_ARN: matchmakingTopic.topicArn,
      },
    });

    usersTable.grantReadWriteData(enqueueLambda);
    matchmakingTopic.grantPublish(enqueueLambda);

    // Matchmaker Lambda
    const matchmakerLambda = new lambda.Function(this, 'MatchmakerLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('dist/lambda/matchmaker'),
      environment: {
        QUEUE_URL: matchmakingQueue.queueUrl,
      },
    });

    usersTable.grantReadWriteData(matchmakerLambda);
    sessionsTable.grantReadWriteData(matchmakerLambda);
    matchmakingQueue.grantConsumeMessages(matchmakerLambda);

    // LiveKit Secret
    const livekitSecret = new secretsmanager.Secret(this, 'LiveKitApiSecret', {
      secretName: 'LiveKitSecret',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ api_key: 'devkey' }),
        generateStringKey: 'api_secret',
        excludePunctuation: true,
      },
    });

    // Token Generator Lambda
    const tokenLambda = new lambda.Function(this, 'GenerateTokenLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('dist/lambda/token'),
      environment: {
        SESSION_TABLE: 'Sessions',
        USER_TABLE: 'Users',
        SECRET_NAME: 'LiveKitSecret',
      },
    });

    livekitSecret.grantRead(tokenLambda);
    usersTable.grantReadData(tokenLambda);
    sessionsTable.grantReadData(tokenLambda);

    // Secret manager permissions
    tokenLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['secretsmanager:GetSecretValue'],
        resources: [livekitSecret.secretArn],
      })
    );

    // Daily Points Reset Lambda
    const resetPointsLambda = new lambda.Function(this, 'ResetPointsLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('dist/lambda/reset-points'),
      environment: {
        USER_TABLE: 'Users',
      },
    });

    usersTable.grantReadWriteData(resetPointsLambda);

    // Daily at midnight UTC
    new events.Rule(this, 'DailyResetRule', {
      schedule: events.Schedule.cron({ minute: '0', hour: '0' }),
      targets: [new targets.LambdaFunction(resetPointsLambda)],
    });

    // Grant necessary permissions
    matchmakingQueue.grantConsumeMessages(matchmakerLambda);
    matchmakingTopic.grantPublish(enqueueLambda);
    
    // API Gateway
    const api = new apigateway.RestApi(this, 'ApiGateway', {
      restApiName: 'OneOnOneAPI',
      deployOptions: {
        stageName: 'v1',
      },
    });

    // Define API routes
    api.root.addResource('join').addMethod('POST', new apigateway.LambdaIntegration(enqueueLambda));
    api.root.addResource('status').addMethod('GET', new apigateway.LambdaIntegration(tokenLambda));
    api.root.addResource('token').addMethod('GET', new apigateway.LambdaIntegration(tokenLambda));
    api.root.addResource('leave').addMethod('POST', new apigateway.LambdaIntegration(enqueueLambda));
  }
}

