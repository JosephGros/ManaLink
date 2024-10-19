import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(req: Request) {
    const { userIds } = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return NextResponse.json({ success: false, message: 'User IDs are required' }, { status: 400 });
    }

    try {
        await dbConnect();

        const users = await User.find({ _id: { $in: userIds } });

        if (users.length === 0) {
            return NextResponse.json({ success: false, message: 'No users found' }, { status: 404 });
        }

        const userData = users.map(user => ({
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
            userCode: user.userCode,
            role: user.role,
            gamesPlayed: user.gamesPlayed,
            gamesWon: user.gamesWon,
            xp: user.xp,
            level: user.level,
            friends: user.friends,
            friendRequestsSent: user.friendRequestsSent,
            friendRequestsReceived: user.friendRequestsReceived,
            playgroups: user.playgroups,
            achievements: user.achievements
        }));

        return NextResponse.json({
            success: true,
            users: userData,
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: 'Server Error', error: error.message }, { status: 500 });
    }
}