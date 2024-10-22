import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextRequest } from "next/server";

interface UserWithFriends {
    _id: string;
    friends: {
      _id: string;
      username: string;
      profilePicture: string;
      level: number;
    }[];
  }

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await dbConnect();

    const { userId } = params;

    const user = await User.findById(userId)
      .populate("friends", "_id username profilePicture level")
      .lean()as UserWithFriends | null;
      
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      friends: user.friends,
    });
  } catch (error: any) {
    console.error("Error fetching user's friends:", error);
    return NextResponse.json(
      { error: "Failed to fetch friends", details: error.message },
      { status: 500 }
    );
  }
}