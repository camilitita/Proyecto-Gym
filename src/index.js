import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import accessRoutes from "./routes/accessRoutes.js";
import membershipsRoutes from "./routes/membershipsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import registroAccesoRoutes from './routes/registroAccesoRoutes.js';

import errorHandling from "./middlewares/errorHandler.js";

import createUserTable from "./data/createUserTable.js";
import createMembershipTable from "./data/createMembershipsTable.js";
import createRegistroAccesoTable from './data/createRegistroAccesoTable.js';

import startMembershipCronJob from "./utils/cronJobs.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/memberships", membershipsRoutes);
app.use("/api", authRoutes);
app.use("/api", registroAccesoRoutes);

// Error handler
app.use(errorHandling);

// Ruta de prueba de conexión
app.get("/", async (req, res) => {
  const result = await pool.query("SELECT current_database()");
  res.send(`The database name is: ${result.rows[0].current_database}`);
});

// Inicio del servidor + setup
const init = async () => {
  try {
    await createUserTable();
    await createMembershipTable();
    await createRegistroAccesoTable();

    startMembershipCronJob();

    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
      console.log("⏱️ Cron jobs para membresías iniciados.");
    });
  } catch (error) {
    console.error("❌ Error al iniciar la aplicación:", error);
    process.exit(1);
  }
};

init();
