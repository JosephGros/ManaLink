import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Playgroup from '@/models/Playgroup';
import jwt from 'jsonwebtoken';

const JWT_SECRET: any = process.env.JWT_SECRET;

const generatePlaygroupCode = async (): Promise<string> => {

    const min = 100000;
    const max = 999999;
    let playgroupCode: string = '';
    let isUnique = false;

    while (!isUnique) {
        playgroupCode = Math.floor(Math.random() * (max - min + 1)) + min + '';

        const existingPlaygroup = await Playgroup.findOne({ playgroupCode });
        if (!existingPlaygroup) {
            isUnique = true;
        }
    }

    return playgroupCode;
};

export async function POST(req: Request) {
    await dbConnect();

    const cookieStore = req.headers.get('cookie') || '';
    const token = cookieStore.split('token=')[1]?.split(';')[0];
    const playgroupCode = await generatePlaygroupCode();

    if (!token) {
        return NextResponse.json({ success: false, error: 'No token found, please log in' }, { status: 401 });
    }

    let currentUserId;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        currentUserId = (decoded as any).id;
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid token, please log in again' }, { status: 401 });
    }

    try {
        const { name } = await req.json();

        const newPlaygroup = await Playgroup.create({
            name,
            members: [currentUserId],
            admin: currentUserId,
            moderators: [],
            games: [],
            calendar: [],
            playgroupCode: playgroupCode,
            profilePicture: '/assets/profile-pics/mtg.webp',
            xp: 0,
            level: 1,
        });

        return NextResponse.json(newPlaygroup, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}