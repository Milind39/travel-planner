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
    setLoading("generate");
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
    setLoading("add");
    if (!trip) return;

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trip),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error saving trip:", err);
        toast.error("Failed to save trip.");
        return;
      }

      const savedTrip = await res.json();
      toast.success("Trip added to database successfully!", savedTrip);

      // Update local trip state
      setTrip(savedTrip);
      // Force refresh server component to get new trip
      // router.refresh();

      // Optionally navigate to /trips if you want
      router.push("/trips");
    } catch (err) {
      console.error("Request failed:", err);
      toast.error("Error saving trip.");
    } finally {
      setLoading(null); // reset loader
    }
  };

  return (
    <>
      {/* Dashboard Button (hidden on mobile) */}
      <div className="hidden sm:block mb-6">
        <DashBoardButton />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 pt-20 lg:pt-28">
        {/* Left: Form Section */}
        <Card className="p-4 sm:p-6 shadow-lg rounded-2xl border backdrop-blur-md border-indigo-600 bg-indigo-600/40">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
            AI Trip Planner
          </h1>

          <input
            type="text"
            placeholder="Destination (e.g., Tokyo, Japan)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="rounded-lg w-full p-2 mb-4 border-indigo-300 border focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                  "w-full px-3 py-2 rounded-md border-indigo-300 border",
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
                  "w-full px-3 py-2 rounded-md border-indigo-300 border",
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
            className="rounded w-full p-2 mb-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 border-indigo-300 border"
            required
          />

          {trip ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddTrip}
                variant="default"
                className="flex-1 bg-emerald-600 hover:bg-emerald-600/90 text-white flex justify-center items-center"
              >
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
          <div className="space-y-6 mt-6 lg:mt-0">
            {/* Header */}
            <div className="bg-[#cc66daa7] border-gray-400 border-2 p-4 rounded-lg shadow text-center">
              <h2 className="text-lg sm:text-xl font-bold">
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
              <p className="text-foreground pt-2 sm:pt-3 text-sm sm:text-base">
                <span className="font-bold">Start:</span> {tripPlan.startDate} &{" "}
                <span className="font-bold">End:</span> {tripPlan.endDate}
              </p>
            </div>

            {/* Carousel */}
            {/* Carousel */}
            {/* Carousel */}
            <div className="relative overflow-x-auto lg:overflow-visible">
              <Carousel className="w-full lg:w-[680px] h-[250px] sm:h-[500px] lg:h-[300px] flex gap-8">
                <CarouselContent className="flex space-x-4 sm:space-x-6 cursor-pointer select-none">
                  {tripPlan.itinerary.map((dayPlan, idx) => (
                    <CarouselItem
                      key={idx}
                      className="min-w-[250px] sm:min-w-[400px] lg:min-w-auto flex-shrink-0"
                    >
                      <div className="p-3 sm:p-4 border rounded-lg shadow-sm bg-[#f9ea9799] hover:shadow-md transition h-auto flex flex-col">
                        <h3 className="font-semibold text-black text-sm sm:text-base">
                          Day {dayPlan.day}: {dayPlan.title}
                        </h3>
                        <ul className="mt-2 sm:mt-3 space-y-1 sm:space-y-2 text-xs sm:text-sm">
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

                {/* Styled Arrows */}
                <CarouselPrevious className="hidden sm:block mb-6 absolute left-[-2rem] top-1/3 transform -translate-y-1/2 bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 shadow-lg z-10" />
                <CarouselNext className="hidden sm:block mb-6 absolute right-[-2rem] top-1/3 transform -translate-y-1/2 bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 shadow-lg z-10" />
              </Carousel>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
