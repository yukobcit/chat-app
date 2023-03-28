import { updateChat } from "@cognito-sst/core/database";

export async function main(event) {
  try {
    console.log(event.body)
    const body = JSON.parse(event.body);
    const name = body.name;
    const userId = body.user_id;

    const chatId = event.pathParameters.id; // get the chatId from the path parameters
    const result = await updateChat(chatId, name, userId);

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  } catch (error) {
    console.error("Error updating chat name: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to update chat name." }),
    };
  }
}
