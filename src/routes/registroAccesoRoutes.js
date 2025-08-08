import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// GET: Obtener registros de acceso (todos o filtrados)
router.get('/registro-acceso', async (req, res) => {
  const { desde, hasta, usuario_id, admin_id } = req.query;

  let query = `
    SELECT ra.id, ra.fecha_acceso,
          u.name AS usuario_nombre, u.email AS usuario_email,
          a.name AS admin_nombre, a.email AS admin_email
    FROM registro_acceso ra
    JOIN users u ON ra.usuario_id = u.id
    JOIN users a ON ra.admin_id = a.id
    WHERE 1=1
  `;

  const values = [];
  let count = 1;

  if (desde) {
    query += ` AND ra.fecha_acceso >= $${count++}`;
    values.push(desde);
  }

  if (hasta) {
    query += ` AND ra.fecha_acceso <= $${count++}`;
    values.push(hasta);
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

router.get('/test', (req, res) => {
  res.send('Funciona 🎉');
});

export default router;
