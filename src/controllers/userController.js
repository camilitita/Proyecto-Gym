// controllers/userController.js
import {
  activateUserService,
  createUserService,
  deleteUserService,
  getAllUserService,
  getUserByIdService,
  updateUserService
} from "../models/userModel.js";
import handleResponse from "../utils/handleResponse.js";
import { encryptText } from "../utils/encryptQR.js";
import QRCode from "qrcode";
import { sendEmailWithQR } from "../utils/sendEmail.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("Creando usuario con:", { name, email });

    const newUser = await createUserService(
      name,
      email,
      password,
      role || "user"
    );

    // 🔐 Generar QR seguro (base64url)
    let encryptedData = encryptText(newUser.id.toString());

    // Reemplazar caracteres conflictivos para que el lector físico no los distorsione
    encryptedData = encryptedData
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    console.log("Texto encriptado seguro para QR:", encryptedData);

    const qrCodeDataURL = await QRCode.toDataURL(encryptedData);
    console.log("QR Code Data URL generado:", qrCodeDataURL);

    await updateUserService(
      newUser.id,
      name,
      email,
      qrCodeDataURL,
      "user",
      true
    );
    await sendEmailWithQR(email, qrCodeDataURL, name);

    handleResponse(res, 201, "Usuario registrado y QR enviado", {
      user: newUser,
      qr_code: qrCodeDataURL
    });
  } catch (err) {
    console.error("Error al crear usuario en el controlador:", err);
    next(err);
  }
};

// El resto de métodos no cambian
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUserService();
    handleResponse(res, 200, "User fetched successfully", users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User fetched successfully", user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const { name, email, qr_code, role, is_active } = req.body;
  try {
    const updatedUser = await updateUserService(
      req.params.id,
      name,
      email,
      qr_code,
      role,
      is_active
    );
    if (!updatedUser) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User updated successfully", updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserService(req.params.id);
    if (!deletedUser) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User deactivated successfully", deletedUser);
  } catch (err) {
    next(err);
  }
};

export const activateUser = async (req, res, next) => {
  try {
    const activatedUser = await activateUserService(req.params.id);
    if (!activatedUser) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User activated successfully", activatedUser);
  } catch (err) {
    next(err);
  }
};
