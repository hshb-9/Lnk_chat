import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
import { deleteMessages, deleteSingleMessage } from "../controllers/message.controller.js";


const router = express.Router();

router.get("/users",protectRoute, getUsersForSidebar);
router.get("/:id",protectRoute,getMessages);

// Bulk delete messages
router.delete("/", protectRoute, deleteMessages);


// Single message delete
router.delete("/:messageId", protectRoute, deleteSingleMessage);

router.post("/send/:id",protectRoute, sendMessage);

export default router;

