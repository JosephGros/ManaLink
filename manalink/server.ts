import { Server } from "socket.io";
import http from "http";

const httpServer = http.createServer();
const io = new Server(httpServer);

io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

  socket.on("join_dm", (dmId) => {
    socket.join(dmId);
  });

  socket.on("join_group", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send_message", (data) => {
    const { roomId, dmId, content, senderId } = data;

    if (dmId) {
      io.to(dmId).emit("receive_message", data);
    } else if (roomId) {
      io.to(roomId).emit("receive_message", data);
    }

  });

  socket.on("disconnect", () => {
    // console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(3000, () => {
//   console.log("Socket.IO server running on port 3000");
});
