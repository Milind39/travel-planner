"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

export async function reorderItinerary(tripId: string, newOrder: string[]) {
  const { userId } = await auth(); // Clerk auth (await if your version requires it)

  if (!userId) {
    throw new Error("Not authenticated");
  }

  await prisma.$transaction(
    newOrder.map((locationId: string, key: number) =>
      prisma.location.update({
        where: { id: locationId },
        data: { order: key },
      })
    )
  );
}
