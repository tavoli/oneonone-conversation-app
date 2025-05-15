import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class AuthStack extends Stack {
  public readonly userPool: cognito.UserPool;
  public readonly identityPool: cognito.CfnIdentityPool;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1. User Pool
    this.userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'OneOnOneAppUserPool',
      selfSignUpEnabled: false,
      signInAliases: { email: true },
      autoVerify: { email: true },
    });

    const googleClientId = this.node.tryGetContext('googleClientId') || 'dummy-client-id';
    const googleClientSecret = this.node.tryGetContext('googleClientSecret') || 'dummy-secret';

    // 2. Google Identity Provider
    new cognito.UserPoolIdentityProviderGoogle(this, 'Google', {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      userPool: this.userPool,
      scopes: ['openid', 'email', 'profile'],
      attributeMapping: {
        email: cognito.ProviderAttribute.GOOGLE_EMAIL,
        givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
        familyName: cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
      },
    });

    // 3. User Pool Client
    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      generateSecret: false,
      oAuth: {
        callbackUrls: ['http://localhost:3000'],
        logoutUrls: ['http://localhost:3000'],
        flows: { authorizationCodeGrant: true },
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
        ],
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.GOOGLE,
      ],
    });

    // 4. Identity Pool
    this.identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      identityPoolName: 'OneOnOneAppIdentityPool',
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });
  }
}

