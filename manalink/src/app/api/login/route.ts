import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const JWT_SECRET: any = process.env.JWT_SECRET;

const normalizeIp = (ip: string) => {
    if (ip.startsWith('::ffff:')) {
        return ip.replace('::ffff:', '');
    }
    return ip;
};

export async function POST(req: Request) {
    try {
        const { email, password, ipAddress } = await req.json();
        await dbConnect();

        const oneHour = 3600;

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'User does not exist' }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
        }

        if (user.twoFactorEnabled) {
            const knownIp = user.knownDevices.find((device: any) => normalizeIp(device.ip) === normalizeIp(ipAddress));
            console.log('Known IP : ', knownIp);

            if (knownIp) {
                console.log("Known IP matched, skipping 2FA");

                const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

                const response = NextResponse.json({ message: 'Login successful!', token }, { status: 200 });

                response.cookies.set('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: oneHour,
                    path: '/',
                    sameSite: 'lax',
                });

                return response;
            } else {
                return NextResponse.json({ twoFactorRequired: true, userId: user._id }, { status: 200 });
            }
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        const response = NextResponse.json({ message: 'Login successful!', token }, { status: 200 });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: oneHour,
            path: '/',
            sameSite: 'lax',
        });

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: 'Error during login', details: error.message }, { status: 500 });
    }
}