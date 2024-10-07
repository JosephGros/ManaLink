import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import DM from '@/models/DM';
import Message from '@/models/Message';

export async function GET(req: Request, { params }: { params: { dmId: string } }) {
    await dbConnect();
    
    const { dmId } = params;
  
    try {
      const messages = await Message.find({ dmId }).sort({ createdAt: 1 }).exec();
      return NextResponse.json(messages);
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }

export async function POST(req: Request) {
    await dbConnect();

    const { senderId, recipientId, firstMessage } = await req.json();

    if (!senderId || !recipientId || !firstMessage) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const existingDM = await DM.findOne({
            members: { $all: [senderId, recipientId], $size: 2 }
        });

        let dmId;

        if (existingDM) {
            dmId = existingDM._id;
        } else {
            const newDM = await DM.create({
                members: [senderId, recipientId],
                createdAt: new Date(),
            });
            dmId = newDM._id;
        }

        const newMessage = await Message.create({
            content: firstMessage,
            senderId,
            recipientId: recipientId,
            dmId: dmId,
            type: 'user',
            createdAt: new Date(),
            readBy: [senderId],
        });

        return NextResponse.json({ message: 'DM started successfully', dmId, newMessage }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}