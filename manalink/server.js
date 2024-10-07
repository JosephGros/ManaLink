const next = require('next');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
const httpServer = http.createServer(server);

const io = new Server(httpServer, {
  path: '/api/socket',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

global._io = io;

app.prepare().then(() => {
  io.on('connection', (socket) => {
    console.log('Socket.IO client connected:', socket.id);

    socket.on('join_dm', (dmId) => {
      socket.join(dmId);
      console.log(`User ${socket.id} joined DM: ${dmId}`);
    });

    socket.on('join_group', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined Group: ${roomId}`);
    });

    socket.on('send_message', (data) => {
      const { roomId, dmId, content } = data;
      if (dmId) {
        io.to(dmId).emit('receive_message', data);
      } else if (roomId) {
        io.to(roomId).emit('receive_message', data);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO client disconnected:', socket.id);
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
