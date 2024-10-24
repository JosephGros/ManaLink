import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET: any = process.env.JWT_SECRET;

export async function GET(req: Request) {
  await dbConnect();

  const cookieStore = req.headers.get('cookie') || '';
  const token = cookieStore.split('token=')[1]?.split(';')[0];

  if (!token) {
    return NextResponse.json(
      { success: false, error: "No token found, please log in" },
      { status: 401 }
    );
  }

  let userId;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = (decoded as any).id;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid token, please log in again" },
      { status: 401 }
    );
  }

  try {
    const user = await User.findById(userId).select("decks").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, decks: user },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}