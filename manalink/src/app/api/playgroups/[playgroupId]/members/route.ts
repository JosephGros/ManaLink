import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Playgroup from '@/models/Playgroup';

export async function GET(req: Request, { params }: { params: { playgroupId: string } }) {
    const { playgroupId } = params;

    try {
        await dbConnect();

        const playgroup = await Playgroup.findById(playgroupId);
        if (!playgroup) {
            return NextResponse.json({ message: 'Playgroup not found' }, { status: 404 });
        }

        const members = playgroup.members;

        if (!members || members.length === 0) {
            return NextResponse.json({ message: 'No members found in the playgroup' }, { status: 404 });
        }

        return NextResponse.json(members, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching playgroup members:", error);
        return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
}