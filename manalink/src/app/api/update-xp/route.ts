import { NextApiRequest, NextApiResponse } from "next";
import addXpAndLevelUp from "@/lib/xp";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId, xpEarned } = req.body;

    try {
      const updatedUser = await addXpAndLevelUp(userId, xpEarned);
      res.status(200).json({ success: true, user: updatedUser });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}