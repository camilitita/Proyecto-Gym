import express from "express";
import {
  activateUser,
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser
} from "../controllers/userController.js";
import validateUser from "../middlewares/inputValidator.js";

const router = express.Router();

// Ruta para el registro de nuevos usuarios (POST /api/users)
router.post("/", validateUser, createUser);

// Ruta para obtener todos los usuarios (GET /api/users)
router.get("/", getAllUsers);

// Ruta para obtener un usuario por ID (GET /api/users/:id)
// CORRECCIÓN: Cambiado de "/user/:id" a "/:id"
router.get("/:id", getUserById);

// Ruta para actualizar un usuario por ID (PUT /api/users/:id)
// CORRECCIÓN: Cambiado de "/user/:id" a "/:id"
router.put("/:id", validateUser, updateUser);

// Ruta para desactivar un usuario por ID (PATCH /api/users/:id/deactivate)
// CORRECCIÓN: Cambiado de "/user/:id/deactivate" a "/:id/deactivate"
router.patch("/:id/deactivate", deleteUser);

// Ruta para activar un usuario por ID (PATCH /api/users/:id/activate)
// CORRECCIÓN: Cambiado de "/user/:id/activate" a "/:id/activate"
router.patch("/:id/activate", activateUser);

export default router;