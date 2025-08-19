import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await checkUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not logged in or creation failed" },
        { status: 401 }
      );
    }

    const body = await req.formData();
    const title = body.get("title") as string;
    const description = body.get("description") as string;
    const startDate = new Date(body.get("startDate") as string);
    const endDate = new Date(body.get("endDate") as string);
    const imageUrl = body.get("imageUrl") as string | null;

    if (!title || !description || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        imageUrl: imageUrl || undefined,
        userId: user.id, // Prisma User.id
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create trip" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await checkUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not logged in" },
        { status: 401 }
      );
    }

    const trips = await prisma.trip.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(trips);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}
