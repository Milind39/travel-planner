import { prisma } from "@/lib/prisma";
import TripDetailClient from "@/components/trips/TripsDetailsClient";
import { auth } from "@clerk/nextjs/server";

export default async function TripDetail({
  params,
}: {
  params: { tripId: string };
}) {
  const { tripId } = params;

  // Clerk session
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return <div>Please sign in.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    return <div>Please sign in.</div>;
  }

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: user.id },
    include: { locations: true },
  });

  if (!trip) {
    return (
      <div className="container mx-auto pt-24 flex justify-center">
        <h1 className="border rounded-lg p-3 font-bold w-40 flex justify-center backdrop-blur-sm">
          Trip not found !!
        </h1>
      </div>
    );
  }

  return <TripDetailClient trip={trip} />;
}
