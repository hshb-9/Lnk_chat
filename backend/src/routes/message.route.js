import express from "express";
import {
  getMessages,
  sendMessage,
  deleteMessageById,
  deleteMessagesBulk,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, sendMessage);
router.get("/:userId", protectRoute, getMessages);
router.delete("/:id", protectRoute, deleteMessageById);      // Single delete
router.delete("/", protectRoute, deleteMessagesBulk);        // Bulk delete

export default router;
