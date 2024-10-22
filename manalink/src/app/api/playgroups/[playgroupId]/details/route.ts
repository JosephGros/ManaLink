import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Playgroup from '@/models/Playgroup';

export async function POST(req: Request) {
  const { playgroupId } = await req.json();

  if (!playgroupId) {
    console.error('Playgroup ID is missing');
    return NextResponse.json({ success: false, message: 'Playgroup ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const playgroup = await Playgroup.findById(playgroupId);
    if (!playgroup) {
      console.error(`Playgroup with ID ${playgroupId} not found`);
      return NextResponse.json({ success: false, message: 'Playgroup not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      playgroup: {
        _id: playgroup._id,
        playgroupname: playgroup.name,
        profilePicture: playgroup.profilePicture,
        playgroupCode: playgroup.playgroupCode,
        members: playgroup.members,
        games: playgroup.games,
        admin: playgroup.admin,
        xp: playgroup.xp,
        level: playgroup.level,
        moderators: playgroup.moderators,
        calendar: playgroup.calendar,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching playgroup:', error);
    return NextResponse.json({ success: false, message: 'Server Error', error: error.message }, { status: 500 });
  }
}
