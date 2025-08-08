// routes/accessRoutes.js
import express from "express";
import { validateAccess } from "../controllers/accessController.js";
import { getAllMemberships } from "../controllers/membershipController.js";

const router = express.Router();
router.post("/validate", validateAccess);

export default router;
