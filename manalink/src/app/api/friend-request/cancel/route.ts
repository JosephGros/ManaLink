import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import FriendRequest from "@/models/FriendRequest";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        const { senderId, recipientId } = await req.json();

        await dbConnect();

        const user = await User.findById(senderId);
        const friend = await User.findById(recipientId);

        if (!user || !friend) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const existingRequest = await FriendRequest.findOne({
            senderId,
            receiverId: recipientId,
            status: "pending",
        });

        if (!existingRequest) {
            return NextResponse.json({ error: "Friend request does not exist" }, { status: 400 });
        }

        await FriendRequest.findByIdAndDelete(existingRequest._id);

        user.friendRequestsSent = user.friendRequestsSent.filter((id: mongoose.Types.ObjectId) =>
            !id.equals(recipientId)
        );

        friend.friendRequestsReceived = friend.friendRequestsReceived.filter((id: mongoose.Types.ObjectId) =>
            !id.equals(senderId)
        );

        await user.save();
        await friend.save();

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error canceling friend request:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}