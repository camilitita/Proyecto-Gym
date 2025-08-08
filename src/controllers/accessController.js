import { validateAccessService } from "../models/accessModel.js";
import handleResponse from "../utils/handleResponse.js";
import decryptQR from "../utils/decryptQR.js";
import pool from "../config/db.js";

// Función para limpiar caracteres raros del QR y dejarlo en formato válido
const sanitizeQR = (qr) => {
  return qr
    .replace(/[^A-Za-z0-9\-_]/g, "") // Mantener solo caracteres válidos Base64 URL-safe
    .trim();
};

export const validateAccess = async (req, res, next) => {
  try {
    let { qr_code } = req.body;

    console.log("🔍 QR bruto recibido:", JSON.stringify(qr_code));

    // Limpiamos antes de desencriptar
    qr_code = sanitizeQR(qr_code);
    console.log("🧹 QR limpio para desencriptar:", qr_code);

    // Intentar desencriptar
    let userId;
    try {
      userId = decryptQR(qr_code);
      if (!userId) {
        console.warn("⚠️ La desencriptación resultó vacía.");
        return handleResponse(res, 400, "Formato de QR inválido o desencriptación fallida.");
      }
      console.log("✅ ID de usuario desencriptado:", userId);
    } catch (decryptError) {
      console.error("Error al desencriptar el QR:", decryptError);
      return handleResponse(res, 400, "Error en el formato del código QR.");
    }

    // Buscar datos de membresía
    const accessInfo = await validateAccessService(userId);
    if (!accessInfo)
      return handleResponse(res, 403, "Acceso denegado: sin membresía activa");

    const adminId = 1; // por ahora fijo

    // Evitar accesos duplicados en menos de 2 minutos
    const recentlyAccessed = await pool.query(
      `
      SELECT 1 FROM registro_acceso
      WHERE usuario_id = $1
      AND fecha_acceso >= NOW() - INTERVAL '2 minutes'
      LIMIT 1
      `,
      [userId]
    );

    if (recentlyAccessed.rowCount > 0) {
      console.log("🛑 Acceso duplicado evitado.");
      return handleResponse(res, 200, "Acceso ya registrado recientemente.", {
        name: accessInfo.name,
        email: accessInfo.email,
        end_date: accessInfo.end_date
      });
    }

    // Insertar el registro de acceso
    try {
      await pool.query(
        "INSERT INTO registro_acceso (usuario_id, admin_id) VALUES ($1, $2)",
        [userId, adminId]
      );
      console.log("✅ Acceso registrado en la base de datos");
    } catch (insertError) {
      console.error("❌ Error al registrar acceso en la base de datos:", insertError);
    }

    // Responder con datos del usuario
    handleResponse(res, 200, "Acceso permitido", accessInfo);
  } catch (err) {
    console.error("Error en el controlador validateAccess:", err);
    next(err);
  }
};
