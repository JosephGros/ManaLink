import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { authenticator } from "otplib";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const JWT_SECRET: any = process.env.JWT_SECRET;

export async function POST(req: Request) {
    try  {
        const { userId, currentPassword, newUsername, newEmail, newPassword, twoFactorCode } = await req.json();

        if (!userId || userId.trim() === "") {
            return NextResponse.json({ error: 'Invalid or missing userId' }, { status: 400 });
        }

        await dbConnect();
        const  user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        };

        const isValid2FA = authenticator.check(twoFactorCode, user.twoFactorSecret);
        if (!isValid2FA) {
            return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 400 });
        };

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        };

        if (newUsername) {
            user.username = newUsername;
        };

        if (newEmail) {
            user.email = newEmail;
        };

        if (newPassword) {
            user.password = newPassword;
        };

        await user.save();

        const jwtToken = jwt.sign({ id: user.userId, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        return NextResponse.json({ message: 'Profile updated successfully!', token: jwtToken }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}