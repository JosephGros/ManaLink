import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Game from '@/models/Game';
import Playgroup from '@/models/Playgroup';
import User from '@/models/User';
import mongoose from 'mongoose';

interface Deck {
    commanderId: mongoose.Types.ObjectId;
    deckName: string;
    commanderName: string;
    manaCost: string;
    image_uris: {
        small: string;
        normal: string;
        large: string;
        png: string;
        art_crop: string;
        border_crop: string;
    };
    mana_symbols: {
        symbol: string;
        svg_uri: string;
    }[];
    wins: { gameId: mongoose.Types.ObjectId }[];
    losses: { gameId: mongoose.Types.ObjectId }[];
}

export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const playgroupId = searchParams.get('playgroupId');

        if (!playgroupId) {
            return NextResponse.json({ success: false, error: 'Playgroup ID is required' }, { status: 400 });
        }

        const games = await Game.find({ playgroupId });

        if (games.length === 0) {
            return NextResponse.json({ success: true, games: [] });
        }

        return NextResponse.json({ success: true, games });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();

        const {
            date,
            playgroupId,
            playgroupName,
            winningUserId,
            winningUsername,
            amountOfPlayers,
            winningDeck
        } = await req.json();

        const newGame = new Game({
            date,
            playgroupId,
            playgroupName,
            winningUserId,
            winningUsername,
            amountOfPlayers,
            winningDeck,
        });

        const savedGame = await newGame.save();

        const playgroup = await Playgroup.findById(playgroupId);

        if (playgroup) {
            playgroup.games.push(savedGame._id);
            await playgroup.save();
        } else {
            return NextResponse.json({ success: false, error: 'Playgroup not found' }, { status: 404 });
        }

        const user = await User.findById(winningUserId);

        if (user) {
            user.gamesWon += 1;
            user.wins.push(savedGame._id);

            const deck: Deck | undefined = user.decks.find(
                (deck: Deck) => deck.commanderId.toString() === winningDeck.commanderId
            );

            if (deck) {
                deck.wins.push({ gameId: savedGame._id });
            }

            await user.save();
        }

        return NextResponse.json({ success: true, game: savedGame });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}