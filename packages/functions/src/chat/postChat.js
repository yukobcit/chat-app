import { createChat } from "@cognito-sst/core/database";

export async function main(event) {

  const  body  = JSON.parse(event.body);
  const  name  = body.name; 
  const  user_id  =  body.user_id;// Get the chat name from the POST body
  const  user_name  =  body.user_name
  const chat = await createChat(name, user_id, user_name)
  return {
    statusCode: 200,
    body: JSON.stringify({ chat: chat }),
  }
}
