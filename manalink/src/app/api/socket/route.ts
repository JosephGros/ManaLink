export const dynamic = "force-dynamic";

import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const secretKey: any = process.env.JWT_SECRET;

const initializeSocketServer = async (res: NextApiResponse) => {

    const socketServer = res.socket as any;

    if (!socketServer.server.io) {
        // https://mana-link.se
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

        io.on('connection', (socket) => {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return socket.disconnect(true);
            }

            jwt.verify(token, secretKey, (error: any, decoded: any) => {
                if (error) {
                    return socket.disconnect(true);
                }

                socket.on("invite_response", (data) => {
                    const { inviteId, status } = data;

                    io.to(inviteId).emit("invite_response", {
                        inviteId,
                        status,
                    });
                });

                socket.on('join_dm', (dmId) => {
                    socket.join(dmId.toString());
                });

                socket.on('join_group', (roomId) => {
                    socket.join(roomId);
                });

                socket.on('send_message', (msg) => {
                    if (msg.dmId) {
                        io.to(msg.dmId).emit('receive_message', msg);
                    } else if (msg.roomId) {
                        io.to(msg.roomId).emit('receive_message', msg);
                    } else {
                        io.emit('receive_message', msg);
                    }
                });

                socket.on('disconnect', () => {
                    // console.log('Client disconnected');
                });
            });
        });

        socketServer.server.io = io;

    } else {
        // console.log('WebSocket server is already running.');
    }
};

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    await initializeSocketServer(res);
    res.end();
}

export default GET;
