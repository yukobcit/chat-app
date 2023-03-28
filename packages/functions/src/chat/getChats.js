

import { getChats } from "@cognito-sst/core/database";

export async function main(event) {

  const connectionString = process.env.DATABASE_URL;
  console.log("connectionstring",connectionString);
  const chats = await getChats()
  console.log(chats);
  return {
    statusCode: 200,
    body: JSON.stringify({ chats: chats }),
  }
}