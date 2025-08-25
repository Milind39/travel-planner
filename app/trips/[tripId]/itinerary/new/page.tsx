import NewLocationClient from "@/components/trips/NewLocation";
import DashBoardButton from "@/components/DashboardButton";

export default async function NewLocation({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  return (
    <div className="pt-12">
      <div className="hidden sm:block">
        <DashBoardButton />
      </div>

      <NewLocationClient tripId={tripId} />
    </div>
  );
}
