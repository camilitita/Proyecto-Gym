import crypto from "crypto";

const SECRET_KEY = process.env.QR_SECRET_KEY || "clave-super-secreta";
const IV_LENGTH = 16;

const fromBase64UrlSafe = (base64url) => {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) base64 += "=";
  return base64;
};

const decryptQR = (encryptedText) => {
  try {
    const raw = Buffer.from(fromBase64UrlSafe(encryptedText), "base64");

    const iv = raw.subarray(0, IV_LENGTH);
    const encryptedData = raw.subarray(IV_LENGTH);

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(SECRET_KEY, "utf-8"),
      iv
    );

    let decrypted = decipher.update(encryptedData, undefined, "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("❌ Error desencriptando QR:", err.message);
    return null;
  }
};

export default decryptQR;
