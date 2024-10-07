import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Playgroup from '@/models/Playgroup';
import User from '@/models/User';
import Message from '@/models/Message';
import Invite from '@/models/Invite';
import mongoose from 'mongoose';

export async function POST(req: Request, { params }: { params: { playgroupId: string } }) {
    const { playgroupId } = params;
    const { inviterId, inviteeId } = await req.json();

    try {
        await dbConnect();

        const playgroup = await Playgroup.findById(playgroupId);
        if (!playgroup) {
            return NextResponse.json({ message: 'Playgroup not found' }, { status: 404 });
        }

        const inviter = await User.findById(inviterId);
        const invitee = await User.findById(inviteeId);
        if (!inviter || !invitee) {
            return NextResponse.json({ message: 'Users not found' }, { status: 404 });
        }

        let existingRoom = await Message.findOne({
            type: 'user',
            $or: [
              { senderId: inviterId, recipientId: inviteeId },
              { senderId: inviteeId, recipientId: inviterId }
            ]
          });
          
          const dmId = existingRoom ? existingRoom.dmId : new mongoose.Types.ObjectId();

        const newInvite = new Invite({
            playgroupId,
            inviterId,
            inviteeId,
            status: 'pending',
        });
        await newInvite.save();

        const inviteMessage = `You have been invited to join the playgroup "${playgroup.name}".`;

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

        return NextResponse.json({ message: 'Invitation sent', invite: newInvite }, { status: 200 });
    } catch (error: any) {
        console.error("Error sending invite:", error);
        return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
}