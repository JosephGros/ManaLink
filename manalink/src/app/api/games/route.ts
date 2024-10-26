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

interface Participant {
    userId: string;
    deckId: string;
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
            winningDeck,
            participants
        }: {
            date: Date;
            playgroupId: string;
            playgroupName: string;
            winningUserId: string;
            winningUsername: string;
            amountOfPlayers: number;
            winningDeck: Deck;
            participants: Participant[];
        } = await req.json();

        console.log("Incoming data for new game creation:", {
            date,
            playgroupId,
            playgroupName,
            winningUserId,
            winningUsername,
            amountOfPlayers,
            winningDeck,
            participants,
        });

        const newGame = new Game({
            date,
            playgroupId,
            playgroupName,
            winningUserId,
            winningUsername,
            amountOfPlayers,
            winningDeck,
            participants: participants.map(({ userId }) => userId)
        });

        const savedGame = await newGame.save();
        if (!savedGame) throw new Error("Game save operation failed.");

        const playgroup = await Playgroup.findById(playgroupId);
        if (playgroup) {
            playgroup.games.push(savedGame._id);
            await playgroup.save();
        } else {
            return NextResponse.json({ success: false, error: 'Playgroup not found' }, { status: 404 });
        }

        await Promise.all(
            participants.map(async ({ userId, deckId }: Participant) => {
                const user = await User.findById(userId);
                if (user) {
                    user.gamesPlayed += 1;
                    if (userId === winningUserId) {
                        user.gamesWon += 1;
                    }
                    
                    const deck = user.decks.find((d: Deck) => d.commanderId.toString() === deckId.toString());
                    if (deck) {
                        if (userId === winningUserId) {
                            deck.wins.push({ gameId: savedGame._id });
                        } else {
                            deck.losses.push({ gameId: savedGame._id });
                        }
                    }                    
                    await user.save();
                }
            })
        );

        return NextResponse.json({ success: true, game: savedGame });
    } catch (error: any) {
        console.error("Error in POST /api/games:", error);
        return NextResponse.json({ success: false, error: error.message });
    }
}