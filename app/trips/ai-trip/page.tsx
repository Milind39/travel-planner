"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import DashBoardButton from "@/components/DashboardButton";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AiTripPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interests, setInterests] = useState("");
  const [tripPlan, setTripPlan] = useState<{
    destination: string;
    startDate: string;
    endDate: string;
    itinerary: {
      day: number;
      title: string;
      activities: string[];
    }[];
  } | null>(null);
  const [loading, setLoading] = useState<null | "generate" | "add">(null);
  const [trip, setTrip] = useState<{
    destination: string;
    startDate: string;
    endDate: string;
    interests: string;
    plan: string;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading("generate"); // mark generate button as loading
    setTripPlan(null);
    setTrip(null);

    try {
      const res = await fetch("/api/ai-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          interests,
        }),
      });

      const data = await res.json();
      console.log("Ai data :", data);
      if (data.destination && data.itinerary) {
        setTripPlan(data);
        setTrip({
          destination,
          startDate,
          endDate,
          interests,
          plan: JSON.stringify(data),
        });
        toast.success("Trip plan generated successfully!");
      } else {
        console.error("Invalid plan format:", data);
        toast.error("Failed to generate trip plan.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating trip plan.");
    } finally {
      setLoading(null);
    }
  };

  const handleAddTrip = async () => {
    if (!trip) return;

    console.log("Generated Trip:", trip);

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trip), // send full JSON
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error saving trip:", err);
        toast.error("Failed to save trip.");
        return;
      }

      const savedTrip = await res.json();
      console.log("Trip saved successfully:", savedTrip);
      toast.success("Trip added to database successfully!");
      router.push("/trips");
    } catch (err) {
      console.error("Request failed:", err);
      toast.error("Error saving trip.");
    }
  };

  return (
    <>
      <DashBoardButton />

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-16 pt-32 mt-10">
        {/* Left: Form Section */}

        <Card className="p-6 shadow-lg rounded-2xl border backdrop-blur-md border-indigo-600 bg-indigo-600/40">
          <h1 className="text-2xl font-bold mb-4">AI Trip Planner</h1>

          <input
            type="text"
            placeholder="Destination (e.g., Tokyo, Japan)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="rounded-lg w-full p-2 mb-4 border-indigo-300 border focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={cn(
                  "w-full px-3 py-2 rounded-md border-indigo-300 border ",
                  "focus:outline-none focus:ring-1 focus:ring-indigo-500"
                )}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={cn(
                  "w-full  px-3 py-2 rounded-md border-indigo-300 border ",
                  "focus:outline-none focus:ring-1 focus:ring-indigo-500"
                )}
                required
              />
            </div>
          </div>

          <textarea
            placeholder={`+What do you want to explore? (e.g., food, culture, hiking),
+What is your Checkin location`}
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className=" rounded w-full p-2 mb-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 border-indigo-300 border "
            required
          />

          {trip ? (
            <div className="flex gap-4">
              <Button
                onClick={handleAddTrip}
                variant="default"
                className="flex-1 bg-emerald-600 hover:bg-emerald-600/90 text-foreground"
              >
                {" "}
                {loading === "add" ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" /> Adding...
                  </>
                ) : (
                  "Add Trip"
                )}
              </Button>
              <Button
                onClick={() => {
                  setTrip(null);
                  setTripPlan(null);
                }}
                variant="secondary"
                className="flex-1 bg-indigo-500 text-white hover:bg-indigo-400"
              >
                Generate New Trip
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleGenerate}
              variant="default"
              className="w-full bg-indigo-500 text-white hover:bg-indigo-400 flex items-center justify-center gap-2"
            >
              {loading === "generate" ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" /> Generating...
                </>
              ) : (
                "Generate Trip Plan"
              )}
            </Button>
          )}
        </Card>

        {/* Right: Carousel Section */}
        {tripPlan && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#cc66daa7] border-gray-400 border-2 p-4 rounded-lg shadow text-center">
              <h2 className="text-xl font-bold">
                {tripPlan.destination
                  ? tripPlan.destination
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" Trip")
                  : ""}
                {" Trip"}
              </h2>
              <p className="text-foreground pt-3">
                <span className="font-bold">Start:</span> {tripPlan.startDate} &{" "}
                <span className="font-bold">End:</span> {tripPlan.endDate}
              </p>
            </div>

            {/* Carousel */}
            <Carousel className="w-full h-[100px] sm:h-[800px] lg:h-[400px]">
              <CarouselContent className="h-auto w-auto cursor-pointer select-none">
                {tripPlan.itinerary.map((dayPlan, idx) => (
                  <CarouselItem
                    key={idx}
                    className="basis-1/1 lg:basis-1/2 w-auto"
                  >
                    <div className="p-4 border rounded-lg shadow-sm bg-[#f9ea9799] hover:shadow-md transition h-auto flex flex-col">
                      <h3 className="font-semibold text-black">
                        Day {dayPlan.day}: {dayPlan.title}
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {dayPlan.activities.map((activity, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-blue-600 font-semibold">
                              •
                            </span>
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
      </div>
    </>
  );
}
