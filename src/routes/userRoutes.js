import express from "express";
import pool from "../config/db.js"; // Asegúrate de importar pool para la ruta activos
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

// Ruta para obtener la cantidad de usuarios activos (GET /api/users/activos)
router.get("/activos", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) AS count FROM users WHERE is_active = true`
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error("❌ Error al obtener usuarios activos:", error);
    res.status(500).json({ count: 0 });
  }
});

// Ruta para obtener un usuario por ID (GET /api/users/:id)
router.get("/:id", getUserById);

// Ruta para actualizar un usuario por ID (PUT /api/users/:id)
router.put("/:id", validateUser, updateUser);

// Ruta para desactivar un usuario por ID (PATCH /api/users/:id/deactivate)
router.patch("/:id/deactivate", deleteUser);

// Ruta para activar un usuario por ID (PATCH /api/users/:id/activate)
router.patch("/:id/activate", activateUser);

export default router;
