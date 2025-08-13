import pool from "../config/db.js";

// Obtener todas las membresías con nombre de la usuaria
export const getAllMembershipsService = async () => {
  const result = await pool.query(`
    SELECT m.*, u.name AS user_name
    FROM memberships m
    JOIN users u ON m.user_id = u.id
  `);
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
  try {
    const result = await pool.query(
      `INSERT INTO memberships (user_id, start_date, end_date, is_active)
       VALUES ($1, $2, $3, true)
       RETURNING *`,
      [user_id, start_date, end_date]
    );
    return result.rows[0];
  } catch (error) {
    // Código PostgreSQL para violación de restricción única
    if (error.code === '23505') {
      // Ya existe una membresía con esos datos
      return null;
    }
    // Otros errores se lanzan normalmente
    throw error;
  }
};


export const renewMembershipService = async (id) => {
  // Primero obtenemos la membresía por ID
  const membership = await getMembershipByIdService(id);
  if (!membership) return null; // No existe la membresía
  if (membership.is_active) return null; // Ya está activa, no renovar

  const today = new Date();
  // Para la renovación: inicio hoy, fin un mes después
  const newStartDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const newEndDate = nextMonth.toISOString().split('T')[0];

  // (Opcional) Desactivar otras membresías activas de ese usuario
  await pool.query(
    `UPDATE memberships
      SET is_active = false, updated_at = NOW()
      WHERE user_id = $1 AND is_active = true`,
    [membership.user_id]
  );

  // Actualizar la membresía con las nuevas fechas y activar
  const result = await pool.query(
    `UPDATE memberships
      SET start_date = $1, end_date = $2, is_active = true, updated_at = NOW()
      WHERE id = $3
      RETURNING *`,
    [newStartDate, newEndDate, id]
  );

  return result.rows[0];
};

// Actualizar membresía (si se requiere)
export const updateMembershipService = async (id, start_date, end_date, is_active) => {
  // Obtener la membresía para conocer el user_id
  const membership = await getMembershipByIdService(id);
  if (!membership) return null;

  if (is_active) {
    // Desactivar otras membresías activas de ese usuario, excepto esta
    await pool.query(
      `UPDATE memberships
        SET is_active = false, updated_at = NOW()
        WHERE user_id = $1 AND is_active = true AND id != $2`,
      [membership.user_id, id]
    );
  }

  // Actualizar la membresía actual
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