import pool from "../config/db.js";

const createRegistroAccesoTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS registro_acceso (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER NOT NULL,
      admin_id INTEGER NOT NULL,
      fecha_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES users(id),
      FOREIGN KEY (admin_id) REFERENCES users(id)
    )
  `;

  try {
    await pool.query(queryText);
    console.log("✅ Tabla registro_acceso creada (si no existía)");
  } catch (error) {
    console.error("❌ Error al crear la tabla registro_acceso:", error);
  }
};

export default createRegistroAccesoTable;
