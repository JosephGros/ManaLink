import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    userCode: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'moderator', 'user'],
        required: true,
        default: 'user'
    },
    profilePicture: {
        type: String,
        default: '/assets/profile-pics/mtg.webp'
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    gamesPlayed: {
        type: Number,
        default: 0
    },
    gamesWon: {
        type: Number,
        default: 0
    },
    friends: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    friendRequestsSent: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    friendRequestsReceived: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    playgroups: {
        type: [
            {
                playgroupId: mongoose.Schema.Types.ObjectId,
                playgroupName: String
            }],
        default: []
    },
    manalinks: {
        type: [
            {
                playgroupId: mongoose.Schema.Types.ObjectId,
                bookingId: mongoose.Schema.Types.ObjectId
            }],
        default: []
    },
    decks: {
        type: [
            {
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
                    border_crop: String
                  },
                mana_symbols: [
                    {
                      symbol: String,
                      svg_uri: String,
                    },
                  ],
                wins: [
                    {
                        gameId: mongoose.Schema.Types.ObjectId,
                    }],
                losses: [
                    {
                        gameId: mongoose.Schema.Types.ObjectId,
                    }
                ]
            }],
        default: []
    },
    achievements: {
        type: [String],
        default: []
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: {
        type: String,
        required: false
    },
    knownDevices: [
        {
            metadata: {
                browser: String,
                os: String,
            },
            ip: {
                type: String,
                required: true
            }
        }
    ]
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;