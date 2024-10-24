import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
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
        commanderId: mongoose.Schema.Types.ObjectId,
        deckName: String,
        commanderName: String,
        manaCost: String,
        image_uris: {
            small: String,
            normal: String,
            large: String,
            png: String,
            art_crop: String,
            border_crop: String,
        },
        mana_symbols: [
            {
                symbol: String,
                svg_uri: String,
            },
        ],
    },
}, { timestamps: true });

const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);
export default Game;