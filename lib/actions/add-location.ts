"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"; // ✅ Clerk
import { redirect } from "next/navigation";

/**
 * Forward Geocode: address → lat,lng
 */
export async function geocodeAddress(address: string, email: string) {
const response = await fetch(
  `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&namedetails=1&q=${encodeURIComponent(
    address
  )}&email=${encodeURIComponent(email)}`,
  { headers: { "User-Agent": `YourAppName/1.0 (${email})` } }
);

  console.log("Geocoding:", encodeURIComponent(address));


const data = await response.json();
if (!data?.length) throw new Error("Address not found");

const place = data[0];
const name = place.namedetails?.name || place.display_name.split(",")[0];

return {
  lat: parseFloat(place.lat),
  lng: parseFloat(place.lon),
  locationTitle: name, // only the official place name
};
}

/**
 * Reverse Geocode: lat,lng → address
 */
export async function reverseGeocode(lat: number, lng: number, email: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&email=${encodeURIComponent(
      email
    )}`,
    {
      headers: {
        "User-Agent": `YourAppName/1.0 (${email})`,
      },
    }
  );

  const data = await response.json();

  if (!data?.display_name) {
    throw new Error("Location name not found");
  }

  return {
    lat,
    lng,
    locationTitle: data.display_name,
  };
}

export async function addLocation(formData: FormData, tripId: string) {
  // ✅ Get authenticated user
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  // ✅ Get Clerk user details (email for Nominatim)
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || "default@example.com";

  const rawInput = formData.get("address")?.toString();
  if (!rawInput || !rawInput.trim()) {
    throw new Error("Missing address");
  }

  let location;
  const latLngRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;

  try {
    if (latLngRegex.test(rawInput)) {
      // ✅ User entered lat,lng → reverse geocode
      const [latStr, lngStr] = rawInput.split(",");
      const lat = parseFloat(latStr.trim());
      const lng = parseFloat(lngStr.trim());

      location = await reverseGeocode(lat, lng, email);
    } else {
      // ✅ User entered address → forward geocode
      location = await geocodeAddress(rawInput, email);
    }
  } catch (err) {
    console.warn("Could not geocode address, skipping:", rawInput, err);
    return; // skip this location instead of throwing
  }

  // ✅ Skip adding if lat/lng is missing
  if (!location?.lat || !location?.lng) {
    console.warn("Invalid lat/lng, skipping:", location);
    return;
  }

  const count = await prisma.location.count({
    where: { tripId },
  });

  await prisma.location.create({
    data: {
      locationTitle: location.locationTitle,
      lat: location.lat,
      lng: location.lng,
      tripId,
      order: count,
    },
  });

  redirect(`/trips/${tripId}`);
}
