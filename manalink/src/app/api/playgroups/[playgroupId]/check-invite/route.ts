import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Invite from "@/models/Invite";

interface Params {
    params: {
        playgroupId: string;
    };
}

export async function POST(req: Request, { params }: Params) {
    const { playgroupId } = params;
    const { inviteeId } = await req.json();

    try {
        await dbConnect();

        const existingInvite = await Invite.findOne({
            playgroupId,
            inviteeId,
        });

        if (!existingInvite) {
            return NextResponse.json({ status: "none" }, { status: 200 });
        }

        return NextResponse.json({ status: existingInvite.status }, { status: 200 });
    } catch (error) {
        console.error("Error checking invite status:", error);
        return NextResponse.json({ error: "Failed to check invite status" }, { status: 500 });
    }
}