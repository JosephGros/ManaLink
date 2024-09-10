import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET:any = process.env.JWT_SECRET;

export async function POST(req: Request) {
    try {
        const { userId, token } = await req.json();

        await dbConnect();
        const user = await User.findById(userId);

        if (!user || !user.twoFactorSecret) {
            return NextResponse.json({ error: '2FA not set up for this user' }, { status: 400 });
        }

        const isValid = authenticator.check(token, user.twoFactorSecret);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 400 });
        }

        const jwtToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        const oneHour = 3600;

        const response = NextResponse.json({ message: '2FA verification successful!', token: jwtToken }, { status: 200 });
        response.cookies.set('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: oneHour,
            path: '/',
            sameSite: 'lax',
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
