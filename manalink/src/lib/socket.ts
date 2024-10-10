import io from 'socket.io-client';

const token = getCookie('token');
let socket: ReturnType<typeof io> | null = null;

const getSocket = () => {
  if (!socket) {
    // const baseURL = process.env.BASE_URL || 'https://mana-link.se';

    socket = io('wss://mana-link.se', {
      path: '/api/socket',
      transports: ['websocket', 'polling'],
      auth: {
        token: token,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      autoConnect: true,
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

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export default getSocket;