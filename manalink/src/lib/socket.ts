import io from 'socket.io-client';

const socket = io(process.env.BASE_URL || 'http://localhost:3000', {
  path: '/api/socket',
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  autoConnect: true,
  secure: true,
});

socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
  });
  
  socket.on('disconnect', (reason: any) => {
    console.log('Disconnected:', reason);
  });
  
  socket.on('connect_error', (error: any) => {
    console.error('Connection Error:', error);
  });
  
  socket.on('reconnect_attempt', () => {
    console.log('Reconnecting...');
  });
  

export default socket;