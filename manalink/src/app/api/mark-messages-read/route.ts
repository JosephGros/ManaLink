import { NextResponse } from 'next/server';
import Message from '@/models/Message';
import dbConnect from '@/lib/mongoose';

export async function POST(req: Request) {
  const { messageIds, userId } = await req.json();

  try {
    await dbConnect();

    const result = await Message.updateMany(
      { _id: { $in: messageIds }, readBy: { $ne: userId } },
      { $push: { readBy: userId } }
    );

    return NextResponse.json({ message: 'Messages marked as read' }, { status: 200 });
  } catch (error) {
    console.error("Error updating readBy:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}