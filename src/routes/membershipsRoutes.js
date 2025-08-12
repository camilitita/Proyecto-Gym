import express from "express";
import {
  getAllMemberships,
  getMembershipByUserId,
  updateMembership,
  deactivateMembership,
  checkMembershipStatus,
  getMembershipById
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

export default router;