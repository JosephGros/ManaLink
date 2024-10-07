import { NextResponse } from 'next/server';
import Message from '@/models/Message';
import dbConnect from '@/lib/mongoose';

export async function POST(req: Request) {
  const { messageIds, userId } = await req.json();

  console.log("Marking messages as read for user:", userId);
  console.log("Message IDs to update:", messageIds);

  try {
    await dbConnect();

    const result = await Message.updateMany(
      { _id: { $in: messageIds }, readBy: { $ne: userId } },
      { $push: { readBy: userId } }
    );

    console.log("Update Result:", result);

    return NextResponse.json({ message: 'Messages marked as read' }, { status: 200 });
  } catch (error) {
    console.error("Error updating readBy:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}