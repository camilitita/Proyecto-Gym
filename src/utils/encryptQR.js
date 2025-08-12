import crypto from "crypto";

const SECRET_KEY = process.env.QR_SECRET_KEY || "clave-super-secreta"; // Debe tener 32 caracteres
const IV_LENGTH = 16; // Longitud del IV en AES

export const encryptText = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY, "utf-8"),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  // Devolvemos IV + encrypted en Base64 URL-safe
  const result = Buffer.concat([iv, Buffer.from(encrypted, "base64")]).toString("base64");
  return result
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};
