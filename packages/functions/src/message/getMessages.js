import { getMessages } from "@cognito-sst/core/database";

export async function main(event) {
  try {
    const chatId  = event.pathParameters.id;
    const messages = await getMessages(chatId)
    return {
      statusCode: 200,
      body: JSON.stringify({ messages : messages }),
    }
  } catch (error) {
    console.log("Error fetching messages: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch messages" }),
    }
  }
}
