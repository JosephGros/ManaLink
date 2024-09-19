import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/mongoose";

const JWT_SECRET: any = process.env.JWT_SECRET;

export async function POST(req: Request) {
    try {
        const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

        if (!token) {
            return NextResponse.json({ error: "Token not found" }, { status: 401 });
        }

        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userId = (decodedToken as any)?.id;

        if (!userId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { profilePicture } = await req.json();
        user.profilePicture = profilePicture;

        await user.save();

        return NextResponse.json({ message: "Profile picture updated successfully!" });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to update profile picture", details: error.message }, { status: 500 });
    }
}