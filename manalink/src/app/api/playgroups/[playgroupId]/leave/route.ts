import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Playgroup from '@/models/Playgroup';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: Request, { params }: { params: { playgroupId: string } }) {
    const { playgroupId } = params;
    const { userId } = await req.json();

    try {
        await dbConnect();

        const playgroup = await Playgroup.findById(playgroupId);
        if (!playgroup) {
            return NextResponse.json({ message: 'Playgroup not found' }, { status: 404 });
        }

        const isMember = playgroup.members.includes(userId);
        if (!isMember) {
            return NextResponse.json({ message: 'User is not a member of this playgroup' }, { status: 400 });
        }

        playgroup.members = playgroup.members.filter((memberId: mongoose.Types.ObjectId) =>
            memberId.toString() !== userId
        );
        await playgroup.save();

        const user = await User.findById(userId);
        if (user) {
            user.playgroups = user.playgroups.filter((groupId: string) => groupId !== playgroupId);
            await user.save();
        }

        return NextResponse.json({ message: 'Successfully left the playgroup' }, { status: 200 });
    } catch (error: any) {
        console.error('Error leaving playgroup:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}