import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Invite from "@/models/Invite";
import Playgroup from "@/models/Playgroup";
import Message from "@/models/Message";
import User from "@/models/User";

export async function POST(req: Request, { params }: { params: { inviteId: string } }) {
  const { inviteId } = params;
  const { response, userId } = await req.json();

  try {
    await dbConnect();

    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return NextResponse.json({ message: "Invite not found" }, { status: 404 });
    }

    if (invite.status !== "pending") {
      return NextResponse.json({ message: "Invite already responded to" }, { status: 400 });
    }

    const playgroup = await Playgroup.findById(invite.playgroupId);
    if (playgroup?.members.includes(userId)) {
      return NextResponse.json({ message: "User is already a member of the playgroup" }, { status: 400 });
    }

    if (response === "accept") {
      playgroup?.members.push(invite.inviteeId);
      await playgroup?.save();

      invite.status = "accepted";
      await invite.save();

      await User.findByIdAndUpdate(userId, {
        $push: {
          playgroups: {
            playgroupId: playgroup?._id,
            playgroupName: playgroup?.name,
          }
        }
      });

      await Invite.findByIdAndDelete(inviteId);
      await Message.findOneAndDelete({ "metadata.inviteId": inviteId });

      if (global._io) {
        global._io.emit("invite_response", {
          inviteId,
          status: "accepted",
          playgroupId: playgroup?._id,
        });
      }

      return NextResponse.json({ message: "Invite accepted and removed", playgroup }, { status: 200 });
    } else if (response === "decline") {
      invite.status = "declined";
      await invite.save();

      await Invite.findByIdAndDelete(inviteId);
      await Message.findOneAndDelete({ "metadata.inviteId": inviteId });

      if (global._io) {
        global._io.emit("invite_response", {
          inviteId,
          status: "declined",
          playgroupId: playgroup?._id,
        });
      }

      return NextResponse.json({ message: "Invite declined and removed" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid response" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error responding to invite:", error);
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}