import { NextRequest, NextResponse } from 'next/server';
import addXpAndLevelUp from '@/lib/xp';

export async function POST(req: NextRequest) {
  try {
    const { userId, xpEarned } = await req.json();

    if (!userId || typeof xpEarned !== 'number') {
      return NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 });
    }

    const updatedUser = await addXpAndLevelUp(userId, xpEarned);

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}