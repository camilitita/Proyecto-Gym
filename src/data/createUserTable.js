import pool from "../config/db.js";

const createUserTable = async () => {
  const queryText = `
  CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  qr_code TEXT,
  role VARCHAR(20) DEFAULT 'user',
  password VARCHAR(255) NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
  )
  `;

  try {
    pool.query(queryText);
    console.log("User table created if not exists");
  } catch (error) {
    console.log("Error creating users table : ", error);
  }
};

export default createUserTable;