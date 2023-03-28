import { deleteMessage } from "@cognito-sst/core/database";

export async function main(event) {

  try {
    const messageId  = event.pathParameters.id;
    const body = JSON.parse(event.body);
    const userId = body.userId;

    console.log("userId: ", userId);
    console.log("messageId: ", messageId);

    const deletedMessage = await deleteMessage(userId, messageId);
    console.log("deletedMessage: ", deletedMessage);

    if (deletedMessage === undefined) {
      console.log("Message not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Message not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }

  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
