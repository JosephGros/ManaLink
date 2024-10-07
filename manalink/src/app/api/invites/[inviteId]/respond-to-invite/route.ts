import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Invite from '@/models/Invite';
import Playgroup from '@/models/Playgroup';

export async function POST(req: Request, { params }: { params: { inviteId: string } }) {
    const { inviteId } = params;
    const { response, userId } = await req.json();

    try {
        await dbConnect();

        const invite = await Invite.findById(inviteId);
        if (!invite) {
            return NextResponse.json({ message: 'Invite not found' }, { status: 404 });
        }

        if (invite.inviteeId.toString() !== userId) {
            return NextResponse.json({ message: 'You are not authorized to respond to this invite' }, { status: 403 });
        }

        if (response === 'accept') {
            const playgroup = await Playgroup.findById(invite.playgroupId);
            if (!playgroup) {
                return NextResponse.json({ message: 'Playgroup not found' }, { status: 404 });
            }

            if (playgroup.members.length >= playgroup.playerLimit) {
                return NextResponse.json({ message: 'Player limit reached' }, { status: 400 });
            }

            playgroup.members.push(invite.inviteeId);
            await playgroup.save();

            invite.status = 'accepted';
            await invite.save();

            return NextResponse.json({ message: 'Invite accepted', playgroup }, { status: 200 });
        } else if (response === 'decline') {
            invite.status = 'declined';
            await invite.save();
            return NextResponse.json({ message: 'Invite declined' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Invalid response' }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
}