import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io"

// Create express app and HTTP server
const app = express();
const server = http.createServer(app);

// Create Socket.io server
export const io = new Server(server, {
  cors: {origin: "*"}
});

// Store online users
export const userSocketMap = new Map(); // {userId: socketId}

// Socket.io connect handler
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  const { userId } = socket.handshake.query;

  if (userId) {
    console.log(`User with ID: ${userId} connected with socket ID: ${socket.id}`);
    userSocketMap.set(userId, socket.id);
  }

  // emit online users to all connected clients
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    let disconnectedUserId;
    for (const [key, value] of userSocketMap.entries()) {
      if (value === socket.id) {
        disconnectedUserId = key;
        break;
      }
    }
    if (disconnectedUserId) {
      userSocketMap.delete(disconnectedUserId);
    }
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

// Middleware setup
app.use(cors());
app.use(express.json({limit: "4mb"}));

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
