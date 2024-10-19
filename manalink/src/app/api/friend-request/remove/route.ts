import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { userId, friendId } = await req.json();

        await dbConnect();

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return NextResponse.json({ error: 'User or friend not found' }, { status: 404 });
        }

        user.friends = user.friends.filter((id: string) => id.toString() !== friendId);
        friend.friends = friend.friends.filter((id: string) => id.toString() !== userId);

        await user.save();
        await friend.save();

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error removing friend:', error);
        return NextResponse.json({ error: 'Failed to remove friend' }, { status: 500 });
    }
}