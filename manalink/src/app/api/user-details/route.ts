import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(req: Request) {
const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
        userCode: user.userCode,
        role: user.role,
        gamesPlayed: user.gamesPlayed,
        gamesWon: user.gamesWon,
        xp: user.xp,
        level: user.level,
        friends: user.friends,
        friendRequestsSent: user.friendRequestsSent,
        friendRequestsReceived: user.friendRequestsReceived,
        playgroups: user.playgroups,
        achievements: user.achievements
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Server Error', error: error.message }, { status: 500 });
  }
}