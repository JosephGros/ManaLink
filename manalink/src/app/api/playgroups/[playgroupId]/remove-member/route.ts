import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Playgroup from '@/models/Playgroup';

export async function POST(req: Request, { params }: { params: { playgroupId: string } }) {
  const { playgroupId } = params;
  const { memberId } = await req.json();

  try {
    await dbConnect();

    const playgroup = await Playgroup.findById(playgroupId);
    if (!playgroup) {
      return NextResponse.json({ message: 'Playgroup not found' }, { status: 404 });
    }

    if (!playgroup.members.includes(memberId)) {
      return NextResponse.json({ message: 'User is not a member of the playgroup' }, { status: 400 });
    }

    playgroup.members = playgroup.members.filter(
      (member) => member.toString() !== memberId
    );
    await playgroup.save();

    return NextResponse.json({ message: 'User removed from the playgroup', playgroup }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}