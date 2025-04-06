import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsers } from "../controllers/user.controller.js";
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20; // or higher if needed

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);

export default router;
