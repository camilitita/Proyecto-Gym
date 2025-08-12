import { validateAccessService } from "../models/accessModel.js";
import handleResponse from "../utils/handleResponse.js";
import decryptQR from "../utils/decryptQR.js";
import pool from "../config/db.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const validateAccess = async (req, res, next) => {
  try {
    let { qr_code } = req.body;

    console.log("🔍 QR recibido:", qr_code);

    const userId = decryptQR(qr_code);

    if (!userId) {
      console.warn("⚠️ QR inválido o desencriptación fallida.");
      return res.status(400).json({
        message: "Formato de QR inválido o desencriptación fallida."
      });
    }

    console.log("✅ ID de usuario desencriptado:", userId);

    const accessInfo = await validateAccessService(userId);
    if (!accessInfo) {
      return res.status(403).json({
        message: "Acceso denegado: sin membresía activa"
      });
    }

    const adminId = 1; // Temporal, cambiar por el admin real

    // Verificar si el acceso ya se registró en los últimos 2 minutos
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
      return res.status(200).json({
        message: "Acceso ya registrado recientemente.",
        name: accessInfo.name,
        email: accessInfo.email,
        end_date: accessInfo.end_date
      });
    }

    await pool.query(
      "INSERT INTO registro_acceso (usuario_id, admin_id) VALUES ($1, $2)",
      [userId, adminId]
    );

    console.log("✅ Acceso registrado en la base de datos");

    res.status(200).json({
      message: "Acceso permitido",
      name: accessInfo.name,
      email: accessInfo.email,
      end_date: accessInfo.end_date
    });

  } catch (err) {
    console.error("Error en validateAccess:", err);
    next(err);
  }
};
