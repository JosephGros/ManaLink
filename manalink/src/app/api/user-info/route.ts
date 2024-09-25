import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET: any = process.env.JWT_SECRET;

export async function GET(req: Request) {
    try {
        const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

        if (!token) {
            return NextResponse.json({ error: "Token not found" }, { status: 401 });
        }

        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userId = (decodedToken as any)?.id;

        if (!userId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        return NextResponse.json({ userId });
    } catch (error) {
        return NextResponse.json({ error: "Failed to retrieve user info" }, { status: 500 });
    }
}