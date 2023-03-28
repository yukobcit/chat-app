import { postMessage } from "@cognito-sst/core/database";

export async function main(event) {
  try {
    const chatId  = event.pathParameters.id;
    const body = JSON.parse(event.body);
    const content = body.content;
    const userId = body.userId;
    const userName = body.userName;
    console.log(userId);
    const message = await postMessage(chatId, content, userId, userName);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: message }),
    }
  } catch (error) {
    console.log("Error posting message: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error posting message" }),
    }
  }
}
