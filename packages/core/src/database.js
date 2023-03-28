import pg from 'pg'
const { Pool } = pg

const dotenv = require('dotenv');
dotenv.config();

let pool
function getPool() {
  if (!pool) {
    
   const connectionString = process.env.DATABASE_URL;

    pool = new Pool({
      connectionString,
      application_name: "",
      max: 1,
    });
  }
  return pool
}

export async function getChats() {
  const res = await getPool().query(`
  SELECT * FROM chats
  ORDER BY timestamp DESC
  `)
  return res.rows
}

export async function createChat(name, user_id, user_name) {
  const res = await getPool().query(`
  INSERT INTO chats (name, user_id , username)
  VALUES ($1, $2 , $3)
  RETURNING *
  `, [name, user_id , user_name])
  return res.rows[0]
}
export async function deleteChat(id, user_id) {
  const res = await getPool().query(`
      
  DELETE FROM chats
  WHERE id = $1 and user_id = $2
  RETURNING *`
  ,
      [id, user_id]
  );
  return res.rows[0];
}

export async function updateChat(chatId, name, userId) {
  const res = await getPool().query(`
    UPDATE chats
    SET name = $2
    WHERE id = $1 AND user_id = $3
    RETURNING *
  `, [chatId, name, userId]);
  
  if (res.rowCount === 0) { // update failed
    throw new Error('Failed to update chat');
  }
  
  return res.rows[0];
}

export async function getMessages(chatId) {
  const res = await getPool().query(`
    SELECT * FROM messages
    WHERE chat_id = $1
    ORDER BY timestamp DESC
  `, [chatId]);
  return res.rows;
}

export async function postMessage(chatId, content, userId, userName) {
  try {
    const res = await getPool().query(`
      INSERT INTO messages (chat_id, content, user_id, username)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [chatId, content, userId, userName]);

    return res.rows[0];
  } catch (error) {
    console.log("Error posting message: ", error);
    throw new Error("Failed to post message");
  }
}


export async function updateMessage(userId, messageId, content) {
  try {
    const res = await getPool().query(`
      UPDATE messages
      SET content = $1
      WHERE user_id = $2 AND id = $3
      RETURNING *
    `, [content, userId, messageId]);

    if (!res.rows[0]) {
      throw new Error(`Unable to update message with id ${messageId} for user ${userId}`);
    }

    return res.rows[0];
  } catch (error) {
    console.log("Error updating message: ", error);
    throw new Error("Error updating message");
  }
}


export async function deleteMessage(userId, messageId) {
  try {
    const res = await getPool().query(
      `
        DELETE FROM messages
        WHERE user_id = $1 AND id = $2
        RETURNING *
      `,
      [userId, messageId]
    );

    return res.rows[0];
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}