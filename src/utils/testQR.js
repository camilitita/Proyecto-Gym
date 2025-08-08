import dotenv from "dotenv";
dotenv.config();

import { encryptText } from "./utils/encryptQR.js";
import decryptQR from "./utils/decryptQR.js";

// ID de usuario que vamos a simular
const userId = "123";

// Encriptar
const qrString = encryptText(userId);
console.log("📤 QR generado:", qrString);

// Desencriptar (como si viniera del escáner)
const originalText = decryptQR(qrString);
console.log("📥 Texto desencriptado:", originalText);
