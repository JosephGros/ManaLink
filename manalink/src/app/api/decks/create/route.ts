import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET: any = process.env.JWT_SECRET;

export async function POST(req: Request) {
    await dbConnect();

    const cookieStore = req.headers.get('cookie') || '';
    const token = cookieStore.split('token=')[1]?.split(';')[0];

    if (!token) {
        return NextResponse.json({ success: false, error: 'No token found, please log in' }, { status: 401 });
    }

    let userId;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = (decoded as any).id;
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid token, please log in again' }, { status: 401 });
    }

    const { deckName, commanderId, commanderName, image_uris, manaCost, manaSymbols } = await req.json();

    if (!deckName || !commanderId || !commanderName || !manaCost || !manaSymbols) {
        return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const newDeck = {
            deckName,
            commanderId,
            commanderName,
            image_uris,
            manaCost,
            mana_symbols: manaSymbols,
            wins: [],
            losses: []
        };

        user.decks.push(newDeck);
        await user.save();

        return NextResponse.json({ success: true, newDeck }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}