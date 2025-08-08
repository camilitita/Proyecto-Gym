import pool from "../config/db.js";

const createMembershipTable = async () => {
  const queryText = `
  CREATE TABLE IF NOT EXISTS memberships (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
  )
  `;

  try {
    await pool.query(queryText);
    console.log("Membership table created if not exists");
  } catch (error) {
    console.log("Error creating Membership table:", error);
  }
};

export default createMembershipTable;
