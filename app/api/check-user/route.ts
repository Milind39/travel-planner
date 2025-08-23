import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser"; // where you wrote that function

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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
