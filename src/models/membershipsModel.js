import pool from "../config/db.js";

// Obtener todas las membresías
export const getAllMembershipsService = async () => {
  const result = await pool.query("SELECT * FROM memberships");
  return result.rows;
};

// Obtener membresías por ID de usuario
export const getMembershipByUserIdService = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM memberships
    WHERE user_id = $1
    ORDER BY end_date DESC
    LIMIT 1`,
    [user_id]
  );
  return result.rows[0]; // Retorna la membresía más reciente
};
//Trae membresia por id único de la misma
export const getMembershipByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM memberships WHERE id = $1", [id]);
  return result.rows[0];
};

// Crear nueva membresía
export const createMembershipService = async (user_id, start_date, end_date) => {
  const result = await pool.query(
    `INSERT INTO memberships (user_id, start_date, end_date, is_active)
    VALUES ($1, $2, $3, true)
    RETURNING *`,
    [user_id, start_date, end_date]
  );
  return result.rows[0];
};

// Actualizar membresía (si se requiere)
export const updateMembershipService = async (id, start_date, end_date, is_active) => {
  const result = await pool.query(
    `UPDATE memberships
    SET start_date = $1, end_date = $2, is_active = $3, updated_at = NOW()
    WHERE id = $4
     RETURNING *`,
    [start_date, end_date, is_active, id]
  );
  return result.rows[0];
};

// Validar si una clienta tiene membresía activa
// Desactivar membresía
export const deactivateMembershipService = async (user_id) => {
  const result = await pool.query(
    `UPDATE memberships
      SET is_active = false, updated_at = NOW()
      WHERE user_id = $1
     RETURNING *`,
    [user_id]
  );
  return result.rows[0];
};

// Verificar membresía activa (para el QR)
export const checkMembershipStatusService = async (user_id) => {
  const result = await pool.query(
    `SELECT *
      FROM memberships
      WHERE user_id = $1
      AND is_active = true
      AND start_date <= CURRENT_DATE
      AND end_date >= CURRENT_DATE
      ORDER BY end_date DESC
      LIMIT 1`,
    [user_id]
  );
  return result.rows[0];
};

// Desactivar todas las membresías vencidas
export const deactivateExpiredMembershipsService = async () => {
  const result = await pool.query(
    `UPDATE memberships
      SET is_active = false, updated_at = NOW()
      WHERE is_active = true AND end_date < CURRENT_DATE
      RETURNING id, user_id, end_date, is_active`
  );
  return result.rows; // Retorna las membresías que fueron desactivadas
};