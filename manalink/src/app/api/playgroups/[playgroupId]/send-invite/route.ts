import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Playgroup from '@/models/Playgroup';
import User from '@/models/User';
import Message from '@/models/Message';
import Invite from '@/models/Invite';
import mongoose from 'mongoose';
import getSocket from '@/lib/socket';
import DM from '@/models/DM';

export async function POST(req: Request, { params }: { params: { playgroupId: string } }) {
    const { playgroupId } = params;
    const { inviterId, inviteeId } = await req.json();

    try {
        await dbConnect();

        const playgroup = await Playgroup.findById(playgroupId);
        if (!playgroup) {
            return NextResponse.json({ message: 'Playgroup not found' }, { status: 404 });
        }

        if (playgroup.members.includes(inviteeId)) {
            return NextResponse.json({ message: 'User is already a member' }, { status: 400 });
        }

        const inviter = await User.findById(inviterId);
        const invitee = await User.findById(inviteeId);
        if (!inviter || !invitee) {
            return NextResponse.json({ message: 'Users not found' }, { status: 404 });
        }

        let dmId;
        const existingDM = await DM.findOne({
            members: { $all: [inviterId, inviteeId], $size: 2 }
        });

        if (existingDM) {
            dmId = existingDM._id;
        } else {
            const newDM = await DM.create({
                members: [inviterId, inviteeId],
                createdAt: new Date(),
            });
            dmId = newDM._id;
        }

        // const dmId = existingRoom ? existingRoom.dmId : new mongoose.Types.ObjectId();

        const newInvite = new Invite({
            playgroupId,
            inviterId,
            inviteeId,
            status: 'pending',
        });
        await newInvite.save();

        const inviteMessage = `You have been invited to join the playgroup ${playgroup.name}.`;

        const message = new Message({
            content: inviteMessage,
            senderId: inviterId,
            recipientId: inviteeId,
            dmId: dmId,
            type: 'user',
            createdAt: new Date(),
            metadata: { inviteId: newInvite._id },
        });

        await message.save();

        if (global._io) {
            global._io.to(dmId?.toString()).emit('invite_sent', {
                inviteId: newInvite._id,
                playgroupName: playgroup.name,
                inviterId,
                inviteeId,
            });
        }

        return NextResponse.json({ message: 'Invitation sent', invite: newInvite }, { status: 200 });
    } catch (error: any) {
        console.error("Error sending invite:", error);
        return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
}