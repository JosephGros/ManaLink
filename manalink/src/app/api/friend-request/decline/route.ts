import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import FriendRequest from "@/models/FriendRequest";

export async function POST(req: Request) {
    try {
        const { userId, friendId } = await req.json();

        await dbConnect();

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const friendRequest = await FriendRequest.findOne({
            senderId: friendId,
            receiverId: userId,
        });

        if (!friendRequest) {
            return NextResponse.json({ error: "Friend request not found" }, { status: 404 });
        }

        user.friendRequestsReceived = user.friendRequestsReceived.filter(
            (id: string) => id.toString() !== friendId
        );
        friend.friendRequestsSent = friend.friendRequestsSent.filter(
            (id: string) => id.toString() !== userId
        );

        await user.save();
        await friend.save();

        await FriendRequest.findByIdAndDelete(friendRequest._id);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("Error declining friend request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}