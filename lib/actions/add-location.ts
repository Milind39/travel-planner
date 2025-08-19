"use server";


import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";  // ✅ Clerk auth
import { redirect } from "next/navigation";

async function geocodeAddress(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );

  const data = await response.json();

  if (!data.results?.length) {
    throw new Error("Address not found");
  }

  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}

export async function addLocation(formData: FormData, tripId: string) {
  // ✅ Get authenticated user from Clerk
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const address = formData.get("address")?.toString();
  if (!address) {
    throw new Error("Missing address");
  }

  const { lat, lng } = await geocodeAddress(address);

  const count = await prisma.location.count({
    where: { tripId },
  });

  await prisma.location.create({
    data: {
      locationTitle: address,
      lat,
      lng,
      tripId,
      order: count,
      // optional: associate with user if needed
    //   userId,
    },
  });

  redirect(`/trips/${tripId}`);
}
