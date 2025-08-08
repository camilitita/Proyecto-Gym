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
router.get("/:id", getMembershipById);
router.get("/:userId", getMembershipByUserId);
router.put("/:id", validateMembership, updateMembership); // Middleware aquí
router.patch("/deactivate/:userId", deactivateMembership);
router.get("/check/:userId", checkMembershipStatus);

export default router;
