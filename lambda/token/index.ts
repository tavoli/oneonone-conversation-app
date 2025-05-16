import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import jwt from 'jsonwebtoken';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const sessionId = event.queryStringParameters?.sessionId;
  const userId = event.requestContext.authorizer?.claims?.sub;

  if (!sessionId || !userId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing sessionId or userId' }) };
  }

  const client = new SecretsManagerClient({});
  const command = new GetSecretValueCommand({ SecretId: 'LiveKitSecret' });
  const response = await client.send(command);

  if (!response.SecretString) {
    throw new Error('SecretString is undefined');
  }

  const secret = JSON.parse(response.SecretString);

  const token = jwt.sign(
    {
      identity: userId,
      room: sessionId,
      grants: {
        roomJoin: true,
        room: sessionId,
        canPublish: true,
        canSubscribe: true,
      },
    },
    secret.api_secret,
    { expiresIn: '15m', issuer: secret.api_key }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ token, roomName: sessionId }),
  };
};

