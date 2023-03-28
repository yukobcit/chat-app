import { APIGatewayProxyEventBase } from 'aws-lambda';

export async function handler(event, context) {
  // Use the full type for APIGatewayProxyEventBase instead of the alias
  const sub = event.requestContext.authorizer?.jwt.claims.sub;
  const username = event.requestContext.authorizer?.jwt.claims.username;
    
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello world!",
      sub,
      username
    }),
  };
}
