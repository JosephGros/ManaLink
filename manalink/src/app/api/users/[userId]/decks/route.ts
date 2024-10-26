import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;

    try {
        await dbConnect();

        const user = await User.findById(userId).select('decks');

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, decks: user.decks }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching decks:', error);
        return NextResponse.json({ success: false, message: 'Server Error', error: error.message }, { status: 500 });
    }
}