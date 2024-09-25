import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
          }

        const user = await User.findById(userId);
        if (!user || !user.twoFactorEnabled) {
            return NextResponse.json({ error: "2FA is not enabled" }, { status: 400 });
        }

        user.twoFactorEnabled = false;
        user.twoFactorSecret = null;
        await user.save();

        return NextResponse.json({ message: "2FA has been disabled" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}