import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/mongoose";
import { cookies } from "next/headers";

const JWT_SECRET: any = process.env.JWT_SECRET;

export async function GET(req: Request) {
    try {
        const authorizationHeader = req.headers.get("Authorization");
        let token;

        if (authorizationHeader) {
            token = authorizationHeader.split("Bearer ")[1];
        }

        if (!token) {
            const cookieStore = cookies();
            token = cookieStore.get("token")?.value;
        }

        if (!token) {
            return NextResponse.json(
                { error: "Token not found in Authorization header or cookies" },
                { status: 401 }
            );
        }

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decodedToken = jwt.verify(token, JWT_SECRET as string);
        const userId = (decodedToken as any)?.id;

        if (!userId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(userId).lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user, token });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to retrieve user info", details: error.message },
            { status: 500 }
        );
    }
}