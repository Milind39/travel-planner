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

 const contentType = req.headers.get("content-type") || "";

    let title, description, startDate, endDate, imageUrl, aiPlan;

    if (contentType.includes("application/json")) {
      // 🟢 Case 1: AI Trip JSON
      const body = await req.json();
      console.log("Recieved Body",body);
      title = body.title || body.destination;
      description = body.description || body.interests;
      startDate = body.startDate;
      endDate = body.endDate;
      imageUrl = body.imageUrl || null;
      aiPlan = body; // store full JSON in aiPlan
    } else if (contentType.includes("multipart/form-data")) {
      // 🟢 Case 2: Manual Trip Form
      const form = await req.formData();
      title = form.get("title") as string;
      description = form.get("description") as string;
      startDate = form.get("startDate") as string;
      endDate = form.get("endDate") as string;
      imageUrl = form.get("imageUrl") as string | null;
      const aiPlanRaw = form.get("aiPlan") as string | null;
      aiPlan = aiPlanRaw ? JSON.parse(aiPlanRaw) : null;
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 }
      );
    }


    if (!title || !description || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse AI plan safely (if provided)  TODO

    const trip = await prisma.trip.create({
      data: {
        title,
        description,
        startDate: new Date(`${startDate}T00:00:00Z`),
        endDate: new Date(`${endDate}T00:00:00Z`),
        imageUrl: imageUrl || undefined,
        userId: user.id, // Prisma User.id
        aiPlan,
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
