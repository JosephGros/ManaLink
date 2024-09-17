import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET: any = process.env.JWT_SECRET;

export async function POST(req: Request) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);

        await dbConnect();
        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;

        await user.save();

        return NextResponse.json({ message: "Password updated successfully!" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}