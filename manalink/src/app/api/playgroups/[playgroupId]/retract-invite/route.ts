import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Invite from '@/models/Invite';
import Message from '@/models/Message';

interface Params {
  params: {
    playgroupId: string;
  };
}

export async function POST(req: Request, { params }: Params) {
  const { playgroupId } = params;
  const { inviterId, inviteeId } = await req.json();

  try {
    await dbConnect();

    const invite = await Invite.findOneAndDelete({
      playgroupId,
      inviterId,
      inviteeId,
    });

    if (!invite) {
      return NextResponse.json({ message: 'Invite not found' }, { status: 404 });
    }

    await Message.findOneAndDelete({
      'metadata.inviteId': invite._id,
    });

    return NextResponse.json({ message: 'Invite and associated message retracted' }, { status: 200 });
  } catch (error: any) {
    console.error("Error retracting invite:", error);
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}
