import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: Request) {
    try {
        const authorizationHeader = req.headers.get("Authorization");

        if (!authorizationHeader) {
            return NextResponse.json({ error: "Authorization header missing" }, { status: 401 });
        }

        const token = authorizationHeader.split("Bearer ")[1];

        if (!token) {
            return NextResponse.json({ error: "Token not found in Authorization header" }, { status: 401 });
        }

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decodedToken = jwt.verify(token, JWT_SECRET as string);
        const userId = (decodedToken as any)?.id;

        if (!userId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        return NextResponse.json({ userId });
    } catch (error: any) {
        console.error("Error occurred: ", error.message, error.stack);
        return NextResponse.json({ error: "Failed to retrieve user info" }, { status: 500 });
    }
}
