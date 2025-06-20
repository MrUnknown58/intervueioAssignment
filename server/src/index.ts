import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import { registerSocketHandlers } from "./socketHandlers";
import sessionRoutes from "./routes/sessionRoutes";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "*" }));
app.use(express.json());

// Placeholder route
app.get("/", (req, res) => {
  res.send("Polling system backend is running.");
});

app.use("/", sessionRoutes);

registerSocketHandlers(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
