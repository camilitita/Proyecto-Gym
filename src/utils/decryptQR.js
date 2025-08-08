// utils/decryptQR.js
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.QR_SECRET_KEY;

// Convierte Base64 seguro para URL a Base64 normal
const fromBase64UrlSafe = (base64url) => {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "="; // rellenar padding
  }
  return base64;
};

const decryptQR = (encryptedText) => {
  if (!encryptedText) {
    console.error("❌ No se proporcionó texto encriptado.");
    return null;
  }

  try {
    const base64 = fromBase64UrlSafe(encryptedText);

    // AES -> bytes -> UTF8
    const bytes = CryptoJS.AES.decrypt(base64, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      console.error("⚠️ La desencriptación resultó vacía. Clave incorrecta o QR corrupto.");
      return null;
    }

    console.log("✅ Texto desencriptado:", decrypted);
    return decrypted;
  } catch (e) {
    console.error("❌ Error en la desencriptación:", e);
    return null;
  }
};

export default decryptQR;
