import pool from "../config/db.js";
import { createMembershipService } from "./membershipsModel.js";

export const getAllUserService = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

export const getUserByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM users where id = $1", [id]);
  return result.rows[0];
};



export const createUserService = async (name, email, qr_code) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Crear usuario
    const userResult = await client.query(
      `INSERT INTO users (name, email, qr_code, role, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [name, email, qr_code, 'user', true]
    );
    const newUser = userResult.rows[0];

    // Calcular fechas de membresía
    const start_date = new Date();
    const end_date = new Date();
    end_date.setMonth(end_date.getMonth() + 1); // 1 mes de duración

    // Crear membresía
    await client.query(
      `INSERT INTO memberships (user_id, start_date, end_date, is_active)
      VALUES ($1, $2, $3, true)`,
      [newUser.id, start_date, end_date]
    );

    await client.query("COMMIT");
    return newUser;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateUserService = async (id, name, email, qr_code, role, is_active) => {
  const result = await pool.query("UPDATE users SET name=$1, email=$2, qr_code=$3, role=$4, is_active=$5, updated_at=NOW() WHERE id=$6 RETURNING *", [name, email, qr_code, role, is_active, id]);
  return result.rows[0];
};

export const deleteUserService = async (id) => {
  const result = await pool.query(
    "UPDATE users SET is_active = false WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export const activateUserService = async (id) => {
  const result = await pool.query(
    "UPDATE users SET is_active = true WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};