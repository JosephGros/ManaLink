import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Message from '@/models/Message';
import Playgroup from '@/models/Playgroup';
import User from '@/models/User';
import mongoose from 'mongoose';
import DM from '@/models/DM';

export async function GET(req: Request) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    try {

        const dms = await DM.find({ members: userId });
        const playgroups = await Playgroup.find({ members: userId });

        if (playgroups.length === 0 && dms.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const groupMessages = await Message.aggregate([
            {
                $match: {
                    roomId: { $in: playgroups.map(pg => pg._id) },
                    type: 'group'
                }
            },
            {
                $group: {
                    _id: '$roomId',
                    lastMessage: { $last: '$$ROOT' }
                }
            }
        ]);

        const directMessages = await Message.aggregate([
            {
                $match: {
                    type: 'user',
                    $or: [
                        { senderId: new mongoose.Types.ObjectId(userId) },
                        { recipientId: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $group: {
                    _id: '$dmId',
                    lastMessage: { $last: '$$ROOT' }
                }
            }
        ]);

        const groupResults = await Promise.all(playgroups.map(async (playgroup: any) => {
            const lastMessage = groupMessages.find(gm => gm._id.toString() === playgroup._id.toString());

            return {
                id: playgroup._id,
                name: playgroup.name || 'Unknown Group',
                preview: lastMessage ? lastMessage.lastMessage.content : 'No messages yet',
                type: 'group',
                profilePicture: playgroup.profilePicture || '/assets/profile-pics/mtg.webp',
                createdAt: lastMessage ? lastMessage.lastMessage.createdAt : playgroup.createdAt,
                readBy: lastMessage ? lastMessage.lastMessage.readBy || [] : [],
            };
        }));

        const dmResults = await Promise.all(dms.map(async (dm: any) => {
            const lastMessage = directMessages.find(dmMsg => dmMsg._id.toString() === dm._id.toString())?.lastMessage;

            if (!lastMessage) {
                return {
                    id: dm._id,
                    name: "No messages yet",
                    preview: "No content",
                    type: 'user',
                    profilePicture: '/assets/profile-pics/mtg.webp',
                    createdAt: dm.createdAt,
                    readBy: [],
                    otherUserId: null,
                };
            }

            const otherUserId = lastMessage?.senderId.toString() === userId
                ? lastMessage.recipientId
                : lastMessage.senderId;

            const otherUser = await User.findById(otherUserId);
            const otherUserName = otherUser?.username || 'Unknown User';
            const otherUserProfilePicture = otherUser?.profilePicture || '/assets/profile-pics/mtg.webp';

            return {
                id: dm._id,
                name: otherUserName,
                preview: lastMessage?.content || 'No content',
                type: 'user',
                profilePicture: otherUserProfilePicture,
                createdAt: lastMessage?.createdAt || dm.createdAt,
                readBy: lastMessage?.readBy || [],
                otherUserId: otherUserId,
            };
        }));

        const response = [...groupResults, ...dmResults];

        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching message list:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
