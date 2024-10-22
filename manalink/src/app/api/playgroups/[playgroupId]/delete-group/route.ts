import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Playgroup from "@/models/Playgroup";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function DELETE(
    req: Request,
    { params }: { params: { playgroupId: string } }
) {
    await dbConnect();

    const cookieStore = req.headers.get("cookie") || "";
    const token = cookieStore.split("token=")[1]?.split(";")[0];

    if (!token) {
        return NextResponse.json(
            { success: false, error: "No token found, please log in" },
            { status: 401 }
        );
    }

    let currentUserId;
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string);
        currentUserId = (decoded as any).id;
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Invalid token, please log in again" },
            { status: 401 }
        );
    }

    try {
        const playgroup = await Playgroup.findById(params.playgroupId);

        if (!playgroup) {
            return NextResponse.json(
                { success: false, error: "Playgroup not found" },
                { status: 404 }
            );
        }

        if (playgroup.admin.toString() !== currentUserId) {
            return NextResponse.json(
                { success: false, error: "Only the admin can delete the playgroup" },
                { status: 403 }
            );
        }

        await Playgroup.findByIdAndDelete(params.playgroupId);

        return NextResponse.json(
            { success: true, message: "Playgroup successfully deleted" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}