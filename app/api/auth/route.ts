import { checkUser } from "@/lib/checkUser";
import { NextResponse } from "next/server";


export async function GET() {
  const user = await checkUser();

  if (!user) {
    return NextResponse.json({ error: "User not logged in or creation failed" }, { status: 401 });
  }

  return NextResponse.json(user);
}
