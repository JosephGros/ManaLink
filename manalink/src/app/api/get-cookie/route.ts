import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.error("Token not found");
      return NextResponse.json(
        { error: "Token not found in cookies" },
        { status: 401 }
      );
    }

    return NextResponse.json({ token });
  } catch (error: any) {
    console.error("Error retrieving token:", error.message);
    return NextResponse.json(
      { error: "Failed to retrieve token", details: error.message },
      { status: 500 }
    );
  }
}