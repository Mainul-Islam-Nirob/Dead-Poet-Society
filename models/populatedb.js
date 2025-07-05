// dbInit.js 🌿
const { Pool } = require('pg');

const dbURL = process.argv[2];  

if (!dbURL) {
  console.error('❌ Please provide the database URL as a command-line argument.');
  console.error('Example: node dbInit.js "postgresql://user:pass@host/db?sslmode=require"');
  process.exit(1);
}

const pool = new Pool({
  connectionString: dbURL,
  ssl: { rejectUnauthorized: false },
});

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        username VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_member BOOLEAN DEFAULT FALSE,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ users table created or already exists.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        text TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        author_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ messages table created or already exists.');

  } catch (err) {
    console.error('❌ Error creating tables:', err);
  } finally {
    await pool.end();
    console.log('🚪 Database connection closed.');
  }
}

createTables();
