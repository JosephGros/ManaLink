import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Invite from '@/models/Invite';

interface Params {
    params: {
        inviteId: string;
    };
}

export async function GET(req: Request, { params }: Params) {
    const { inviteId } = params;

    try {
        await dbConnect();
        const invite = await Invite.findById(inviteId);

        if (!invite) {
            return NextResponse.json({ message: 'Invite not found' }, { status: 404 });
        }

        return NextResponse.json({ invite }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching invite:', error);
        return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
}