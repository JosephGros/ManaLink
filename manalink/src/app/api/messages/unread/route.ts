import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Message from '@/models/Message';
import User from '@/models/User';

interface Playgroup {
    playgroupId: string;
    playgroupName: string;
}

export async function GET(req: Request) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ success: false, error: "No userId provided" }, { status: 400 });
    }

    try {
        const user = await User.findById(userId).select('playgroups');
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        if (!user.playgroups || !Array.isArray(user.playgroups)) {
            return NextResponse.json({ success: false, error: "No playgroups found for the user" }, { status: 404 });
        }

        const playgroupIds = user.playgroups.map((group: Playgroup) => group.playgroupId);

        const unreadMessages = await Message.find({
            $and: [
                {
                    $or: [
                        { senderId: userId },
                        { recipientId: userId },
                        { roomId: { $in: playgroupIds } }
                    ]
                },
                { readBy: { $ne: userId } }
            ]
        });
        return NextResponse.json(unreadMessages, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching unread messages:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}