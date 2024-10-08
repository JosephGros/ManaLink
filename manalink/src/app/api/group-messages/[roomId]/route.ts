import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Message from '@/models/Message';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: { roomId: string } }) {
    await dbConnect();
    const { roomId } = params;

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const messages = await Message.find({ roomId }).sort({ createdAt: 1 }).exec();

        for (const message of messages) {
            if (!message.readBy.includes(userObjectId)) {
                message.readBy.push(userObjectId);
                await message.save();
            }
        }

        return NextResponse.json(messages, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { roomId: string } }) {
    await dbConnect();
    const { roomId } = params;
    const { content, senderId, type } = await req.json();

    try {
        const newMessageData = {
            content,
            senderId,
            roomId,
            type: 'group',
            createdAt: new Date(),
            readBy: [senderId],
        };

        const newMessage = await Message.create(newMessageData);
        return NextResponse.json(newMessage, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}