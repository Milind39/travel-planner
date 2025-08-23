import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { has, userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { isSubscribed: false, error: "Not logged in" },
        { status: 401 }
      );
    }

    // Check if user has any paid plan
    const isSubscribed = has({ plan: "paid" });

    // Sync to your database
    await db.user.update({
      where: { clerkUserId: userId },
      data: { isSubscribed },
    });

    return NextResponse.json({ isSubscribed });
  } catch (err: any) {
    console.error("Subscription check failed:", err);
    return NextResponse.json(
      { isSubscribed: false, error: err.message },
      { status: 500 }
    );
  }
}
