import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js"; //make sure this file exists
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import cookieParser from "cookie-parser";



dotenv.config();

//Add CORS Middleware before any routes
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // if using cookies
}));
app.use(cookieParser());

// Built-in middlewares
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes); //ensure route file is working

// Connect to DB and start server
server.listen(process.env.PORT || 5001, () => {
  connectToMongoDB();
  
  console.log("Server running on port", process.env.PORT || 5001);
});
