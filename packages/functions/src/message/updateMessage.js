import { updateMessage } from "@cognito-sst/core/database";

export async function main(event) {

  const messageId = event.pathParameters.id;
  const body = JSON.parse(event.body);
  const content = body.content;
  const userId = body.userId;

  console.log("Updating message: ", messageId, " for user: ", userId, " with content: ", content)

  try {
    const updatedMessage = await updateMessage(userId, messageId, content);
    return {
      statusCode: 200,
      body: JSON.stringify(updatedMessage),
    };
  } catch (error) {
    console.log("Error updating message: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error updating message" }),
    };
  }
}
