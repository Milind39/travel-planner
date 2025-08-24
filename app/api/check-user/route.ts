import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";

export async function GET() {
  try {
    const user = await checkUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: unknown) {
    // Safely extract message from unknown
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
