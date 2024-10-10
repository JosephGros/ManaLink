export const dynamic = "force-dynamic";

import { Server as SocketIOServer } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
// const pubClient = createClient({ url: redisUrl });
// const subClient = pubClient.duplicate();
// async function setupRedis() {
//     await pubClient.connect();
//     await subClient.connect();
// }

const secretKey: any = process.env.JWT_SECRET;

const initializeSocketServer = async (res: NextApiResponse) => {
    // await setupRedis();

    const socketServer = res.socket as any;

    if (!socketServer.server.io) {
        console.log('Setting up WebSocket server with Redis...');

        const io = new SocketIOServer(socketServer.server, {
            path: '/api/socket',
            transports: ['websocket', 'polling'],
            cors: {
                origin: 'https://mana-link.se',
                methods: ['GET', 'POST'],
                credentials: true,
            },
            pingTimeout: 90000,
            pingInterval: 25000,
        });

        // io.adapter(createAdapter(pubClient, subClient));


        io.on('connection', (socket) => {
            const token = socket.handshake.auth?.token;

            if (!token) {
                console.log('No token provided');
                return socket.disconnect(true);
            }

            jwt.verify(token, secretKey, (error: any, decoded: any) => {
                if (error) {
                    console.log('Invalid token:', error);
                    return socket.disconnect(true);
                }

                console.log('Authenticated client:', decoded);

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
