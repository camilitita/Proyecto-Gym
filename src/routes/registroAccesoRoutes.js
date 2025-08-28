import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/registro-acceso', async (req, res) => {
  const { desde, hasta, usuario_id, admin_id } = req.query;

  let query = `
  SELECT
    ra.id,
    ra.fecha_acceso,
    u.name AS usuario_nombre,
    u.email AS usuario_email,
    a.name AS admin_nombre,
    a.email AS admin_email
  FROM registro_acceso ra
  JOIN users u ON ra.usuario_id = u.id
  JOIN users a ON ra.admin_id = a.id
  WHERE 1=1
`;

  const values = [];
  let count = 1;

  if (desde) {
    query += ` AND ra.fecha_acceso >= ($${count++}::timestamp AT TIME ZONE 'America/Caracas')`;
    values.push(`${desde} 00:00:00`);
  }

  if (hasta) {
    query += ` AND ra.fecha_acceso <= ($${count++}::timestamp AT TIME ZONE 'America/Caracas')`;
    values.push(`${hasta} 23:59:59`);
  }

  if (usuario_id) {
    query += ` AND ra.usuario_id = $${count++}`;
    values.push(usuario_id);
  }

  if (admin_id) {
    query += ` AND ra.admin_id = $${count++}`;
    values.push(admin_id);
  }

  query += ' ORDER BY ra.fecha_acceso DESC';

  try {
    const result = await pool.query(query, values);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("❌ Error al obtener registros de acceso:", error);
    res.status(500).json({ success: false, message: "Error al obtener registros de acceso." });
  }
});

//Rutas de Dashboard
// 1️) Accesos de hoy
router.get('/registro-acceso/today', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) AS count
        FROM registro_acceso
        WHERE (fecha_acceso AT TIME ZONE 'America/Caracas')::date = CURRENT_DATE`
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error("❌ Error al obtener accesos de hoy:", error);
    res.status(500).json({ count: 0 });
  }
});


// 2️) Últimos N accesos (limit opcional)
router.get('/registro-acceso/ultimos', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const result = await pool.query(
      `SELECT ra.id, ra.fecha_acceso, u.name AS usuario_nombre
        FROM registro_acceso ra
        JOIN users u ON ra.usuario_id = u.id
        ORDER BY ra.fecha_acceso DESC
        LIMIT $1`,
      [limit]
    );
    res.json({ data: result.rows });
  } catch (error) {
    console.error("❌ Error al obtener últimos accesos:", error);
    res.status(500).json({ data: [] });
  }
});
export default router;
