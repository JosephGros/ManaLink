import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


const JWT_SECRET: any = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        await dbConnect();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        };

        const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1h",
        });

        user.resetPasswordToken = resetToken;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `
            <h1>ManaLink</h1>
            <p>Click the link to reset your password: <br> <a href="${resetLink}">${resetLink}</a></p>`,
        });

        return NextResponse.json({ message: "Reset email sent!" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}