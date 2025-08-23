import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";
import { prisma } from "@/lib/prisma";
import { geocodeAddress } from "@/lib/actions/add-location";

export async function POST(req: Request) {
  try {
    const user = await checkUser();

    if (!user) {
      console.error("User not logged in or creation failed");
      return NextResponse.json(
        { error: "User not logged in or creation failed" },
        { status: 401 }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    let title, description, startDate, endDate, imageUrl, aiPlan;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      console.log("Received Body:", body);
      title = body.title || body.destination;
      description = body.description || body.interests;
      startDate = body.startDate;
      endDate = body.endDate;
      imageUrl = body.imageUrl || null;
      aiPlan = body; // store full JSON
    } else if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      title = form.get("title") as string;
      description = form.get("description") as string;
      startDate = form.get("startDate") as string;
      endDate = form.get("endDate") as string;
      imageUrl = form.get("imageUrl") as string | null;
      const aiPlanRaw = form.get("aiPlan") as string | null;
      aiPlan = aiPlanRaw ? JSON.parse(aiPlanRaw) : null;
    } else {
      console.error("Unsupported content type:", contentType);
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 }
      );
    }

    if (!title || !description || !startDate || !endDate) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create Trip
    const trip = await prisma.trip.create({
      data: {
        title,
        description,
        startDate: new Date(`${startDate}T00:00:00Z`),
        endDate: new Date(`${endDate}T00:00:00Z`),
        imageUrl: imageUrl || undefined,
        userId: user.id,
        aiPlan,
      },
    });
    console.log("Trip created successfully:", trip.id);

    // Populate Locations if aiPlan exists
    if (aiPlan) {
      const parsedPlan = typeof aiPlan === "string" ? JSON.parse(aiPlan) : aiPlan;

      // handle nested `plan` string
      const planObject =
        typeof parsedPlan.plan === "string" ? JSON.parse(parsedPlan.plan) : parsedPlan;

      if (planObject.itinerary && Array.isArray(planObject.itinerary)) {
        for (const day of planObject.itinerary) {
          let lat = 0;
          let lng = 0;

          try {
            const geo = await geocodeAddress(day.title, user.email);
            lat = geo.lat;
            lng = geo.lng;
            if (lat && lng) {
              console.log(`Geocoding success: ${day.title} → ${lat},${lng}`);
            } else {
              console.warn(`Geocoding failed for: ${day.title}`);
            }

          } catch (err) {
            console.warn(`Geocoding failed for "${day.title}":`, err);
          }
          await prisma.location.create({
            data: {
              tripId: trip.id,
              locationTitle: day.title,
              description: day.activities.join("\n"),
              order: day.day,
              lat: lat,
              lng: lng,
            },
          });
          console.log(`Location added: Day ${day.day} - ${day.title}`);
        }
      }
    }

    console.log("All locations added successfully for trip:", trip.id);
    return NextResponse.json({ success: true, trip }, { status: 201 });
  } catch (err) {
    console.error("Failed to create trip:", err);
    return NextResponse.json(
      { error: "Failed to create trip" },
      { status: 500 }
    );
  }
}
