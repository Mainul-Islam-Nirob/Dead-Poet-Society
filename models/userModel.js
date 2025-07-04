const pool = require('./db');

async function createUser(firstName, lastName, username, hashedPassword) {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, username, password)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [firstName, lastName, username, hashedPassword]
  );
  return result.rows[0];
}

async function findUserByUsername(username) {
  const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
  return result.rows[0];
}

async function findUserById(id) {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0];
}

async function updateMembershipStatus(userId, status) {
  await pool.query('UPDATE users SET is_member = $1 WHERE id = $2', [status, userId]);
}

async function updateAdminStatus(userId) {
  await pool.query(`UPDATE users SET is_admin = TRUE WHERE id = $1`, [userId]);
}


async function getAllUsers() {
  const result = await pool.query('SELECT id, first_name, last_name, username, is_member, is_admin FROM users ORDER BY id');
  return result.rows;
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
  updateMembershipStatus,
  updateAdminStatus,
  getAllUsers,
};
