// utils/encryptQR.js
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.QR_SECRET_KEY;

// Convierte Base64 normal a Base64 seguro para URL
const toBase64UrlSafe = (base64) => {
  return base64
    .replace(/\+/g, "-") // + → -
    .replace(/\//g, "_") // / → _
    .replace(/=+$/, ""); // quitar padding
};

export const encryptText = (text) => {
  if (!text) {
    throw new Error("Texto vacío, no se puede encriptar.");
  }

  // AES -> string Base64
  const encryptedBase64 = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();

  // Convertir a formato seguro para QR
  const safeString = toBase64UrlSafe(encryptedBase64);

  console.log("🔒 Texto original:", text);
  console.log("📦 Encriptado Base64 seguro para QR:", safeString);

  return safeString;
};
