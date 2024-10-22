const redisAdapter = require("socket.io-redis");
const next = require("next");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

const httpServer = http.createServer(server);

const io = new Server(httpServer, {
  path: "/api/socket",
  cors: {
    origin: process.env.BASE_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global._io = io;

app.prepare().then(() => {
  io.on("connection", (socket) => {

    socket.on("join_dm", (dmId) => {
      socket.join(dmId);
    });

    socket.on("join_group", (roomId) => {
      socket.join(roomId);
    });

    socket.on("send_message", (data) => {
      const { roomId, dmId, content } = data;
      if (dmId) {
        io.to(dmId).emit("receive_message", data);
      } else if (roomId) {
        io.to(roomId).emit("receive_message", data);
      }
    });

    socket.on("disconnect", () => {
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT);
});