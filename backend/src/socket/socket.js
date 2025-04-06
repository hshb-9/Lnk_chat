import { Server } from "socket.io";
import express from "express";
import http from "http";

export const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
  });

  socket.on("newMessage", (data) => {
    socket.broadcast.emit("newMessage", data);
  });
});

export { server };
