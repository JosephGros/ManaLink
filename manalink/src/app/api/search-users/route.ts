import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(req: Request) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    const userCode = searchParams.get('userCode');
    const currentUserId = searchParams.get('currentUserId');

    try {
        const query: any = {};

        if (username) {
            query.username = { $regex: username, $options: 'i' };
        }

        if (userCode) {
            query.userCode = userCode;
        }

        if (currentUserId) {
            query._id = { $ne: currentUserId };
        }

        const users = await User.find(query);

        return NextResponse.json(users, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}