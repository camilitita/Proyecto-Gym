import express from "express";
import {
  getAllMemberships,
  getMembershipByUserId,
  updateMembership,
  deactivateMembership,
  checkMembershipStatus,
  getMembershipById,
  renewMembership  // <-- Importamos el nuevo controlador que vamos a crear
} from "../controllers/membershipController.js";

import { validateMembership } from "../middlewares/inputValidator.js";

const router = express.Router();

router.get("/", getAllMemberships);

// Obtener membresía por usuario → ahora /memberships/user/:userId
router.get("/user/:userId", getMembershipByUserId);

router.get("/:id", getMembershipById);

router.put("/:id", validateMembership, updateMembership);
router.patch("/deactivate/:userId", deactivateMembership);
router.get("/check/:userId", checkMembershipStatus);

// Nueva ruta para renovar membresía (solo para membresías inactivas)
router.patch("/renew/:id", renewMembership);

export default router;
