export const dynamic = "force-dynamic";

import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { NextApiRequest, NextApiResponse } from 'next';

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const pubClient = createClient({ url: redisUrl });
const subClient = pubClient.duplicate();

async function setupRedis() {
    await pubClient.connect();
    await subClient.connect();
}

const initializeSocketServer = async (res: NextApiResponse) => {
    await setupRedis();

    const socketServer = res.socket as unknown as { server: HttpServer & { io?: SocketIOServer } };

    if (!socketServer.server.io) {
        console.log('Setting up WebSocket server with Redis...');

        const io = new SocketIOServer(socketServer.server, {
            path: '/api/socket',
            cors: {
                origin: 'https://mana-link.se',
                methods: ['GET', 'POST'],
                credentials: true,
            },
            pingTimeout: 60000,
            pingInterval: 25000,
        });

        io.adapter(createAdapter(pubClient, subClient));

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

        socketServer.server.io = io;

        console.log('WebSocket server with Redis initialized.');
    } else {
        console.log('WebSocket server is already running.');
    }
};

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    await initializeSocketServer(res);
    res.end();
}

export default GET;
