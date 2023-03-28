import {Api, Cognito } from "sst/constructs";

export function API({ stack }) {
  // Create auth provider
  const auth = new Cognito(stack, "Auth", {
    login: ["email", "username"],
  });

  // Adjust the API 
  const api = new Api(stack, "Api", {
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: "jwt",
      function: {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL,
        },
      }, 
    },
    routes: {

      "GET /chats":{
        function: "packages/functions/src/chat/getChats.main",
        authorizer: "none",
      },

      "POST /chat":"packages/functions/src/chat/postChat.main",
      "DELETE /chat/{id}":"packages/functions/src/chat/deleteChat.main",
      "PUT /chat/{id}":"packages/functions/src/chat/updateChat.main",


      "GET /messages/{id}":{
        function: "packages/functions/src/message/getMessages.main",
        authorizer: "none",
      },
      "POST /message/{id}":"packages/functions/src/message/postMessage.main",
      "DELETE /message/{id}":"packages/functions/src/message/deleteMessage.main",
      "PUT /message/{id}":"packages/functions/src/message/updateMessage.main",

    },
  });


  // Allow authenticated users invoke API
  auth.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
    UserPoolClientId: auth.userPoolClientId,
  });

  return {
    api,
    auth
  }
}
