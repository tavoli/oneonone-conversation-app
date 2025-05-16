import * as cdk from 'aws-cdk-lib';

import { AuthStack } from './stacks/AuthStack';
import { DataStack } from './stacks/DataStack';
import { FrontendStack } from './stacks/FrontendStack';
import { LambdaStack } from './stacks/LambdaStack';
import { VideoStack } from './stacks/VideoStack';

const app = new cdk.App();

new AuthStack(app, 'AuthStack');
const dataStack = new DataStack(app, 'DataStack');
new FrontendStack(app, 'FrontendStack');
new LambdaStack(app, 'LambdaStack', {
  usersTable: dataStack.usersTable,
  sessionsTable: dataStack.sessionsTable,
});
new VideoStack(app, 'VideoStack');
