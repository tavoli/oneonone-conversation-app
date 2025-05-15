import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class DataStack extends Stack {
  public readonly usersTable: dynamodb.Table;
  public readonly sessionsTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Users Table
    this.usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: 'Users',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Sessions Table
    this.sessionsTable = new dynamodb.Table(this, 'SessionsTable', {
      tableName: 'Sessions',
      partitionKey: { name: 'sessionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'expiresAt',
    });

    // Optional GSIs
    this.sessionsTable.addGlobalSecondaryIndex({
      indexName: 'UserSessionsIndexA',
      partitionKey: { name: 'userA', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'startTime', type: dynamodb.AttributeType.STRING },
    });

    this.sessionsTable.addGlobalSecondaryIndex({
      indexName: 'UserSessionsIndexB',
      partitionKey: { name: 'userB', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'startTime', type: dynamodb.AttributeType.STRING },
    });
  }
}

