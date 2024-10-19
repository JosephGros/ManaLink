import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import FriendRequest from "@/models/FriendRequest";

const JWT_SECRET: any = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Token not found in Authorization header or cookies" },
                { status: 401 }
            );
        }

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decodedToken = jwt.verify(token, JWT_SECRET as string);
        const userId = (decodedToken as any)?.id;

        await dbConnect();

        const sentRequests = await FriendRequest.find({ senderId: userId })
            .populate<{ receiverId: { _id: string; username: string; profilePicture: string; level: number } }>(
                "receiverId",
                "_id username profilePicture level"
            )
            .lean();

        const receivedRequests = await FriendRequest.find({ receiverId: userId })
            .populate<{ senderId: { _id: string; username: string; profilePicture: string; level: number } }>(
                "senderId",
                "_id username profilePicture level"
            )
            .lean();

        const combinedSentRequests = sentRequests.map((request) => ({
            _id: request._id,
            senderId: request.senderId,
            receiverId: request.receiverId._id,
            dateSent: request.dateSent,
            status: request.status,
            userInfo: {
                _id: request.receiverId._id,
                username: request.receiverId.username,
                profilePicture: request.receiverId.profilePicture,
                level: request.receiverId.level
            },
        }));

        const combinedReceivedRequests = receivedRequests.map((request) => ({
            _id: request._id,
            senderId: request.senderId._id,
            receiverId: request.receiverId,
            dateSent: request.dateSent,
            status: request.status,
            userInfo: {
                _id: request.senderId._id,
                username: request.senderId.username,
                profilePicture: request.senderId.profilePicture,
                level: request.senderId.level
            },
        }));

        return NextResponse.json({
            received: combinedReceivedRequests,
            sent: combinedSentRequests,
        });
    } catch (error: any) {
        console.error("Error fetching friend requests:", error);
        return NextResponse.json(
            { error: "Failed to fetch friend requests", details: error.message },
            { status: 500 }
        );
    }
}