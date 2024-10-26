import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        playgroupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Playgroup',
            required: true,
        },
        playgroupName: {
            type: String,
            required: true,
        },
        winningUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        winningUsername: {
            type: String,
            required: true,
        },
        amountOfPlayers: {
            type: Number,
            required: true,
        },
        winningDeck: {
            commanderId: { type: mongoose.Schema.Types.ObjectId },
            deckName: { type: String },
            commanderName: { type: String },
            manaCost: { type: String },
            image_uris: {
                small: { type: String },
                normal: { type: String },
                large: { type: String },
                png: { type: String },
                art_crop: { type: String },
                border_crop: { type: String },
            },
            mana_symbols: [
                {
                    symbol: { type: String },
                    svg_uri: { type: String },
                },
            ],
        },
        participants: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                deckId: { type: mongoose.Schema.Types.ObjectId },
            },
        ],
    },
    { timestamps: true }
);

const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);
export default Game;