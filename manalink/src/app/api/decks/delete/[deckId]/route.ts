import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET: any = process.env.JWT_SECRET;

export async function DELETE(req: Request, { params }: { params: { deckId: string } }) {
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

    const { deckId } = params;

    if (!ObjectId.isValid(deckId)) {
        return NextResponse.json({ success: false, error: 'Invalid deck ID' }, { status: 400 });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const deckIndex = user.decks.findIndex((deck: any) => deck._id.toString() === deckId);
        if (deckIndex === -1) {
            return NextResponse.json({ success: false, error: 'Deck not found' }, { status: 404 });
        }

        user.decks.splice(deckIndex, 1);
        await user.save();

        return NextResponse.json({ success: true, message: 'Deck deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting deck:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}