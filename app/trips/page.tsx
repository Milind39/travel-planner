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

  if (!dbUser) {
    return (
      <div className="container mx-auto py-8">
        <p>User not found in database.</p>
      </div>
    );
  }

  const trips = await db.trip.findMany({
    where: { userId: dbUser.id },
    orderBy: { startDate: "asc" },
  });

  // ✅ Serialize trips (convert Dates → strings)
  const plainTrips = trips.map((t) => ({
    ...t,
    startDate: t.startDate.toISOString(),
    endDate: t.endDate.toISOString(),
  }));

  // ✅ Pass only serializable props
  return (
    <TripsClient userName={user.fullName ?? "Traveler"} trips={plainTrips} />
  );
}
