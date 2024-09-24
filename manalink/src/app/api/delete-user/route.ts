import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function DELETE(req: Request) {
    try {
        const { userId, password } = await req.json();
        await dbConnect();

        if (!userId || !password) {
            return NextResponse.json({ error: 'User ID and password are required.' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
        }

        await User.deleteOne({ _id: userId });

        return NextResponse.json({ message: 'User account deleted successfully.' }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'An error occurred while deleting the user.' }, { status: 500 });
    }
}