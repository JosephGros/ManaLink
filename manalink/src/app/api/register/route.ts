import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { NextResponse } from 'next/server';

const generateUserCode = async (): Promise<string> => {

    const min = 100000;
    const max = 999999;
    let userCode: string = '';
    let isUnique = false;

    while (!isUnique) {
        userCode = Math.floor(Math.random() * (max - min + 1)) + min + '';

        const existingUser = await User.findOne({ userCode });
        if (!existingUser) {
            isUnique = true;
        }
    }

    return userCode;
};

const sanitizeAndEncodeUTF8 = (str: string): string => {
    if (!str || typeof str !== 'string') {
        throw new Error('Invalid input: expected a valid string');
    }
    return str.trim().normalize('NFC');
};

export async function POST(req: Request) {
    try {
        const { 
            username, 
            email, 
            firstName, 
            lastName, 
            password, 
            confirmPassword, 
            role, 
            xp,
            level,
            gamesPlayed,
            gamesWon,
            friends,
            achievements
        } = await req.json();

        const sanitizedUsername = sanitizeAndEncodeUTF8(username);
        const sanitizedEmail = sanitizeAndEncodeUTF8(email);
        const sanitizedFirstName = sanitizeAndEncodeUTF8(firstName);
        const sanitizedLastName = sanitizeAndEncodeUTF8(lastName);

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Passwords do not match!' }, { status: 400 });
        }

        await dbConnect();

        const userCode = await generateUserCode();
        const userRole = role ?? 'user';
        const userXp = xp ?? 0;
        const userLevel = level ?? 1;
        const userGamesPlayed = gamesPlayed ?? 0;
        const userGamesWon = gamesWon ?? 0;
        const userFriends = friends ?? [];
        const userAchievements = achievements ?? [];
        const user = new User({
            username: username.trim(),
            email: email.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            password,
            userCode,
            role: userRole,
            xp: userXp,
            level: userLevel,
            gamesPlayed: userGamesPlayed,
            gamesWon: userGamesWon,
            friends: userFriends,
            achievements: userAchievements,
        });
        await user.save();

        return NextResponse.json({ message: 'User registered successfully!' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Error registered user', details: error.message }, { status: 500 });
    }
}