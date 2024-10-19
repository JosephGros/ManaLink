import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Playgroup from "@/models/Playgroup";
import { NextRequest } from "next/server";

interface GroupMember {
  _id: string;
  username: string;
  profilePicture: string;
  level: number;
}

export async function GET(req: NextRequest, { params }: { params: { playgroupId: string } }) {
  try {
    await dbConnect();

    const { playgroupId } = params;

    const playgroup = await Playgroup.findById(playgroupId)
      .populate({
        path: 'members',
        select: '_id username profilePicture level',
      })
      .lean();

    if (!playgroup) {
      return NextResponse.json({ error: "Playgroup not found" }, { status: 404 });
    }

    const members: GroupMember[] = playgroup.members as unknown as GroupMember[];

    console.log('API: Playgroup members:', members);

    return NextResponse.json({
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