import User from "@/models/User";
import dbConnect from "./mongoose";
import { calculateRequiredXP } from "./xpConstants";

const addXpAndLevelUp = async (userId: string, xpEarned: number) => {
    await dbConnect();
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    user.xp += xpEarned;
    let newLevel = user.level;

    while (user.xp >= calculateRequiredXP(newLevel)) {
        user.xp -= calculateRequiredXP(newLevel);
        newLevel++;
    }

    user.level = newLevel;
    await user.save();

    return user;
};

export default addXpAndLevelUp;