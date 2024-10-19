import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import FriendRequest from "@/models/FriendRequest";

export async function POST(req: Request) {
    const { senderId, recipientId } = await req.json();

    await dbConnect();

    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingRequest = await FriendRequest.findOne({
        senderId,
        receiverId: recipientId,
        status: 'pending',
    });

    if (existingRequest) {
        return NextResponse.json({ error: "Friend request already sent" }, { status: 400 });
    }

    const newFriendRequest = new FriendRequest({
        senderId,
        receiverId: recipientId,
        status: 'pending',
        dateSent: new Date(),
    });

    await newFriendRequest.save();

    sender.friendRequestsSent.push(recipientId);
    recipient.friendRequestsReceived.push(senderId);

    await sender.save();
    await recipient.save();

    return NextResponse.json({ success: true }, { status: 200 });
}
