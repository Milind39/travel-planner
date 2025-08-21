import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First delete locations belonging to this trip
    await prisma.location.deleteMany({
      where: { tripId: params.id },
    });

    // Then delete the trip
    await prisma.trip.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Trip deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return NextResponse.json(
      { error: "Failed to delete trip" },
      { status: 500 }
    );
  }
}
