import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TripsClient from "@/components/trips/TripsClient";

export default async function TripsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  // ✅ If user not found in DB, redirect to landing page with query param
  if (!dbUser) {
    redirect("/?userNotFound=true");
  }

  const trips = await db.trip.findMany({
    where: { userId: dbUser.id },
    orderBy: { startDate: "asc" },
  });

  const plainTrips = trips.map((t) => ({
    ...t,
    startDate: t.startDate.toISOString(),
    endDate: t.endDate.toISOString(),
  }));

  return (
    <TripsClient userName={user.fullName ?? "Traveler"} trips={plainTrips} />
  );
}
