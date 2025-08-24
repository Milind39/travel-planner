"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Loader2, LockKeyhole, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "../ui/badge";
import { useUser } from "@clerk/nextjs";

type Trip = {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO string now
  endDate: string; // ISO string now
};

export default function TripsClient({
  userName,
  trips,
}: {
  userName: string;
  trips: Trip[];
}) {
  const [loadingButton, setLoadingButton] = useState<
    "new" | "ai" | "create" | null
  >(null);

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();
  const [deleted, setDeleted] = useState(false);
  const { isSignedIn } = useUser();

  const handleNavigate = (type: "new" | "ai" | "create") => {
    setLoadingButton(type);
  };

  const searchParams = useSearchParams();

  //************
  // Fetch the subscription data
  // **********

  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/subscription")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            console.log("DB User:", data);
            setDbUser(data);
          } else {
            toast.error("Failed to load user from DB");
          }
        })
        .catch(() => toast.error("Error connecting to backend"));
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (searchParams.get("refresh") === "true") {
      router.refresh();
    }
  }, [searchParams, router]);

  const upcomingTrips = trips.filter(
    (trip) => new Date(trip.startDate) > new Date()
  );

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  useEffect(() => {
    if (deleted) {
      router.refresh();
      setDeleted(false); // reset after refresh
    }
  }, [deleted, router]);

  const handleDelete = async (tripId: string) => {
    try {
      setLoadingId(tripId);

      const res = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Trip deleted successfully ✅");
        setDeleted(true); // trigger useEffect
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete trip ❌");
      }
    } catch (err) {
      toast.error("Something went wrong ❌");
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 container mx-auto px-4 py-8 mt-10 pt-16">
      {/* Top Header */}
      <div className="flex items-center justify-between border rounded-lg p-3 ">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <div className="flex gap-4">
          <Link href="/trips/new">
            <Button
              onClick={() => handleNavigate("new")}
              className="button-hover bg-black/90 text-white hover:bg-black/70 px-6 py-2 rounded-lg hover:bg-gradient-to-r from-slate-500 via-slate-700 to-black/30"
            >
              {loadingButton === "new" ? (
                <>
                  <Loader2 className="animate-spin" />
                  Trip...
                </>
              ) : (
                "New Trip"
              )}
            </Button>
          </Link>

          <Button
            onClick={() => {
              if (!dbUser?.isSubscribed) {
                toast.error("Subscribe to unlock 🔒");
                return;
              }
              handleNavigate("ai");
              router.push("/trips/ai-trip");
            }}
            className={`
    relative px-6 py-2 rounded-lg text-white font-medium 
    bg-indigo-500
    transition-all duration-300 shadow-md 
    flex items-center justify-center
    ${
      dbUser?.isSubscribed
        ? "hover:bg-gradient-to-l from-indigo-200 via-indigo-400/20 to-indigo-800 button-hover"
        : "hover:bg-indigo-500"
    }
    ${!dbUser?.isSubscribed ? "opacity-50 cursor-not-allowed" : ""}
  `}
          >
            {loadingButton === "ai" ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Trip...
              </>
            ) : (
              <>
                {!dbUser?.isSubscribed && (
                  <LockKeyhole
                    className="text-white h-5 w-5 absolute left-1 top-1/2 -translate-y-1/2"
                    style={{ zIndex: 10 }}
                  />
                )}
                <span>AI Trip</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Welcome Card */}
      <Card className="bg-indigo-300 border-0 text-black">
        <CardHeader>
          <CardTitle>Welcome back, {userName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {trips.length === 0
              ? "Start planning your first trip by clicking the button above."
              : `You have ${trips.length} ${
                  trips.length === 1 ? "trip" : "trips"
                } planned. ${
                  upcomingTrips.length > 0
                    ? `${upcomingTrips.length} upcoming.`
                    : ""
                }`}
          </p>
        </CardContent>
      </Card>

      {/* Recent Trips */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground border rounded-lg p-3">
          Your Recent Trips
        </h2>
        {trips.length === 0 ? (
          <Card className="border-0 backdrop-blur-md bg-indigo-300 text-black">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <h3 className="text-xl font-medium mb-2">No trips yet.</h3>
              <p className="text-center mb-4 max-w-md">
                Start planning your adventure by creating your first trip.
              </p>
              <Link href="/trips/new">
                <Button
                  className="button-hover bg-indigo-500 text-white hover:bg-indigo-500 px-6 py-2 rounded-lg"
                  onClick={() => handleNavigate("create")}
                >
                  {loadingButton === "create" ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" /> Loading...
                    </>
                  ) : (
                    "Create Trip"
                  )}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTrips.slice(0, 6).map((trip) => (
              <Card
                key={trip.id}
                onClick={() => router.push(`/trips/${trip.id}`)}
                className="button-hover border-0 transition-transform duration-300 hover:scale-105 hover:shadow-lg bg-indigo-300 text-black cursor-pointer"
              >
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="line-clamp-1 text-2xl">
                      {trip.title.toUpperCase()}
                    </CardTitle>
                    <Badge
                      className="items-center bg-red-400 hover:bg-red-600 text-white ml-3 cursor-pointer z-10"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent card click
                        handleDelete(trip.id);
                      }}
                      variant="destructive"
                    >
                      {loadingId === trip.id ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Trash2 />
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2 mb-2">
                    {trip.description}
                  </p>
                  <div className="text-sm">
                    {new Date(trip.startDate).toLocaleDateString()} -{" "}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
