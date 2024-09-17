import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { authenticator } from "otplib";
import qrcode from 'qrcode';


export async function POST(req: Request) {
    try {

        await dbConnect();
        const { userId } = await req.json();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const secret = authenticator.generateSecret();
        user.twoFactorSecret = secret;
        user.twoFactorEnabled = true;

        await user.save();

        const otpAuthUrl = authenticator.keyuri(user.email, 'MANALINK', secret);
        const qrCode = await qrcode.toDataURL(otpAuthUrl);

        return NextResponse.json({
            qrCode,
            otpAuthUrl
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}