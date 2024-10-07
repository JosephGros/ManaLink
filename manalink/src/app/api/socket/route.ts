import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Socket } from 'net';

interface SocketWithServer extends Socket {
    server: HttpServer & { io?: SocketIOServer };
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithServer;
}

const initializeSocketServer = (res: NextApiResponseWithSocket) => {
    if (!res.socket.server.io) {
        console.log('Setting up WebSocket server...');

        const io = new SocketIOServer(res.socket.server, {
            path: '/api/socket',
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });

        res.socket.server.io = io;

        io.on('connection', (socket) => {
            console.log('Client connected via WebSocket');

            socket.on('join_dm', (dmId) => {
                socket.join(dmId);
                console.log(`Client joined DM room: ${dmId}`);
            });

            socket.on('join_group', (roomId) => {
                socket.join(roomId);
                console.log(`Client joined group room: ${roomId}`);
            });

            socket.on('send_message', (msg) => {
                if (msg.dmId) {
                    io.to(msg.dmId).emit('receive_message', msg);
                } else if (msg.roomId) {
                    io.to(msg.roomId).emit('receive_message', msg);
                } else {
                    io.emit('receive_message', msg);
                }
                console.log('Message received:', msg);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });

        console.log('WebSocket server initialized.');
    } else {
        console.log('WebSocket server is already running.');
    }
};

export async function GET(req: NextApiRequest, res: NextApiResponseWithSocket) {
    initializeSocketServer(res);
    res.end();
}

export default GET;