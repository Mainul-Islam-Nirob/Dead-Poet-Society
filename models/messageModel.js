const pool = require('./db');

async function createMessage(title, text, authorId) {
  const result = await pool.query(
    `INSERT INTO messages (title, text, author_id) VALUES ($1, $2, $3) RETURNING *`,
    [title, text, authorId]
  );
  return result.rows[0];
}

async function getAllMessages() {
  const result = await pool.query(`
    SELECT messages.*, users.first_name, users.last_name, users.is_member
    FROM messages
    JOIN users ON messages.author_id = users.id
    ORDER BY messages.timestamp DESC
  `);
  return result.rows;
}

// Fetch single message with author details
async function getMessageById(id) {
  const result = await pool.query(`
    SELECT messages.*, users.first_name, users.last_name, users.is_member, users.id as author_id
    FROM messages
    JOIN users ON messages.author_id = users.id
    WHERE messages.id = $1
  `, [id]);

  return result.rows[0];
}

async function deleteMessageById(messageId) {
  await pool.query(`DELETE FROM messages WHERE id = $1`, [messageId]);
}

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  deleteMessageById,
};
