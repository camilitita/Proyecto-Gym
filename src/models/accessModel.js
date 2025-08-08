import pool from "../config/db.js";

export const validateAccessService = async (userId) => {
  const result = await pool.query(
    `SELECT users.id, users.name, users.email, m.start_date, m.end_date, m.is_active
      FROM users
      JOIN memberships m ON users.id = m.user_id
      WHERE users.id = $1 AND m.is_active = true AND CURRENT_DATE BETWEEN m.start_date AND m.end_date`,
    [userId]
  );
  return result.rows[0];
};