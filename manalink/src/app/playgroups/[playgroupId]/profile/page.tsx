import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Playgroup from "@/models/Playgroup";
import jwt from "jsonwebtoken";

const JWT_SECRET: any = process.env.JWT_SECRET;

export async function PATCH(
  req: Request,
  { params }: { params: { playgroupId: string } }
) {
  await dbConnect();

  const cookieStore = req.headers.get("cookie") || "";
  const token = cookieStore.split("token=")[1]?.split(";")[0];

  if (!token) {
    return NextResponse.json(
      { success: false, error: "No token found, please log in" },
      { status: 401 }
    );
  }

  let currentUserId;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    currentUserId = (decoded as any).id;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid token, please log in again" },
      { status: 401 }
    );
  }

  const { profilePicture, xp, level } = await req.json();

  try {
    const playgroup = await Playgroup.findById(params.playgroupId);

    if (!playgroup) {
      return NextResponse.json(
        { success: false, error: "Playgroup not found" },
        { status: 404 }
      );
    }

    if (playgroup.admin.toString() !== currentUserId) {
      return NextResponse.json(
        {
          success: false,
          error: "Only the admin can update the playgroup profile",
        },
        { status: 403 }
      );
    }

    if (profilePicture) playgroup.profilePicture = profilePicture;

    if (typeof xp === "number") playgroup.xp = xp;
    if (typeof level === "number") playgroup.level = level;

    await playgroup.save();

    return NextResponse.json({ success: true, playgroup }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}