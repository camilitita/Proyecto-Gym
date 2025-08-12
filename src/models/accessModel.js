import pool from "../config/db.js";

export const validateAccessService = async (userId) => {
  const query = `
    SELECT
      u.name AS name,
      u.email AS email,
      m.end_date AS end_date
    FROM users u
    JOIN memberships m
      ON u.id = m.user_id
    WHERE u.id = $1
      AND m.is_active = true
      AND CURRENT_DATE BETWEEN m.start_date AND m.end_date
    ORDER BY m.end_date DESC
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows[0] || null;
};
