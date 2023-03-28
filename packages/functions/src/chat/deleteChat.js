import { deleteChat } from "@cognito-sst/core/database";

export async function main(event) {
  try {
    const body = JSON.parse(event.body);
    const user_id = body.user_id;
    const id = event.pathParameters.id; // get the chatId from the path parameters

    const result = await deleteChat(id, user_id)
    console.log("result",result)

    if (result === undefined) {
      console.log("Chat not found");
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "Chat not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  } catch (error) {
    console.error("Error deleting chat", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unable to delete chat" }),
    }
  }
}
