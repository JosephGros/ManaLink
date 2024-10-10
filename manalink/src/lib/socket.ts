import io from 'socket.io-client';

let socket: ReturnType<typeof io> | null = null;

const getSocket = () => {
  if (!socket) {
    const baseURL = process.env.BASE_URL || 'https://mana-link.se';

    socket = io(baseURL, {
      path: '/api/socket',
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      autoConnect: true,
      secure: baseURL.startsWith('https'),
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', (reason: string) => {
      console.log('Disconnected:', reason);
    });

    socket.on('connect_error', (error: Error) => {
      console.error('Connection Error:', error);
    });

    socket.on('reconnect_attempt', () => {
      console.log('Reconnecting...');
    });
  }

  return socket;
};

export default getSocket;