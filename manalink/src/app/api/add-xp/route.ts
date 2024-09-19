import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import addXpAndLevelUp from "@/lib/xp";

export async function POST(req: Request) {
  try {
    const { userId, xpToAdd } = await req.json();

    if (!userId || !xpToAdd) {
      return NextResponse.json({ error: "Missing userId or xpToAdd" }, { status: 400 });
    }

    await dbConnect();

    const user = await addXpAndLevelUp(userId, xpToAdd);

    return NextResponse.json({ message: "XP added successfully!", user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add XP", details: error.message }, { status: 500 });
  }
}
