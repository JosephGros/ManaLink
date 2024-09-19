import { NextResponse } from "next/server";
import addXpAndLevelUp from "@/lib/xp";
import { XP_FOR_GAME_PLAYED, XP_FOR_GAME_WON, XP_FOR_NEW_FRIEND, XP_FOR_NEW_GROUP } from "@/lib/xpConstants";

export async function POST(req: Request) {
  try {
    const { userId, actionType } = await req.json();

    let xpEarned = 0;

    switch (actionType) {
      case "game_played":
        xpEarned = XP_FOR_GAME_PLAYED;
        break;
      case "game_won":
        xpEarned = XP_FOR_GAME_WON;
        break;
      case "new_group":
        xpEarned = XP_FOR_NEW_GROUP;
        break;
      case "new_friend":
        xpEarned = XP_FOR_NEW_FRIEND;
        break;
      default:
        return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
    }

    const updatedUser = await addXpAndLevelUp(userId, xpEarned);
    return NextResponse.json({ user: updatedUser }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}