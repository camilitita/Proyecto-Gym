
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
import { createMembershipService } from "../models/membershipsModel.js";
import dayjs from "dayjs";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("Creando usuario con:", { name, email });

    // 1️⃣ Crear usuario + membresía (todo en una función, que ya hace validación de duplicados)
    const result = await createUserService(
      name,
      email,
      password,
      role || "user"
    );
    const newUser = result.user;
    const membership = result.membership;

    console.log("✅ Usuario y membresía creados o existentes:", newUser, membership);

    // 2️⃣ Generar texto encriptado limpio (para escáner)
    const encryptedQR = encryptText(newUser.id.toString());
    console.log("🔐 Texto encriptado seguro para QR:", encryptedQR);

    // 3️⃣ Generar imagen QR (base64) para email o frontend
    const qrCodeDataURL = await QRCode.toDataURL(encryptedQR);

    // 4️⃣ Guardar tanto el texto encriptado como la imagen QR en la DB
    await updateUserService(
      newUser.id,
      name,
      email,
      encryptedQR,
      role || "user",
      true
    );

    // 5️⃣ Enviar email con el QR
    await sendEmailWithQR(email, qrCodeDataURL, name);

    handleResponse(res, 201, "Usuario registrado con membresía y QR enviado", {
      user: newUser,
      membership,
      qr_code_text: encryptedQR,
      qr_code_image: qrCodeDataURL
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
