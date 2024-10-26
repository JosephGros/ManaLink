import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Playgroup from "@/models/Playgroup";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

interface GroupMember {
    _id: string;
    username: string;
    userCode: string;
    profilePicture: string;
    level: number;
    isAdmin?: boolean;
    isModerator?: boolean;
}

export async function GET(req: NextRequest, { params }: { params: { playgroupId: string } }) {
    try {
        await dbConnect();

        const { playgroupId } = params;

        const playgroup = await Playgroup.findById(playgroupId)
            .populate({
                path: 'members',
                select: '_id username profilePicture level userCode',
            })
            .lean();

        if (!playgroup) {
            return NextResponse.json({ error: "Playgroup not found" }, { status: 404 });
        }

        const adminId = playgroup.admin.toString();
        const moderatorIds = playgroup.moderators.map((modId: mongoose.Types.ObjectId) => modId.toString());

        const members: GroupMember[] = playgroup.members.map((member: any) => ({
            ...member,
            isAdmin: member._id.toString() === adminId,
            isModerator: moderatorIds.includes(member._id.toString()),
        }));

        return NextResponse.json({
            name: playgroup.name,
            members,
        });
    } catch (error: any) {
        console.error("Error fetching playgroup members:", error);
        return NextResponse.json(
            { error: "Failed to fetch members", details: error.message },
            { status: 500 }
        );
    }
}