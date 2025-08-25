"use client";

import dynamic from "next/dynamic";
import { Location, Trip } from "@/app/generated/prisma";
import Image from "next/image";
import { Calendar, ChevronLeft, Loader2, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SortableItinerary from "@/components/sortable-itinerary";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export type TripWithLocation = Trip & {
  locations: Location[];
};

interface TripDetailClientProps {
  trip: TripWithLocation;
}

// Import Map dynamically (disable SSR)
const Map = dynamic(() => import("../map"), {
  ssr: false,
});

export default function TripDetailClient({ trip }: TripDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingButton, setLoadingButton] = useState<"add" | "back" | null>(
    null
  );

  const handleNavigate = (type: "add" | "back") => {
    setLoadingButton(type);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 pt-24">
      {" "}
      {trip.imageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative bg-">
          <Image
            src={trip.imageUrl}
            alt={trip.title}
            className="object-cover"
            fill
            priority
          />
        </div>
      )}
      <div className="bg-black/40 backdrop-blur-md border-0  p-6 shadow rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="text-foreground">
          <h1 className="text-4xl font-extrabold ">
            {" "}
            {trip.title.toUpperCase()}
          </h1>

          <div className="flex items-center  mt-2">
            <Calendar className="h-5 w-5 mr-2" />
            <span className="text-lg">
              {trip.startDate.toLocaleDateString()} -{" "}
              {trip.endDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            href={`/trips/${trip.id}/itinerary/new`}
            onClick={() => handleNavigate("add")}
          >
            <Button className="button-hover bg-indigo-500 text-white hover:bg-indigo-500 px-6 py-2 rounded-lg flex items-center">
              {loadingButton == "add" ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Plus className="mr-2 h-5 w-5" />
              )}
              Add Location
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-black/40 backdrop-blur-md border-0 text-foreground p-6 shadow rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-8">
            <TabsList className="bg-gray-500 pl-0 pr-0">
              <TabsTrigger
                value="overview"
                className="text-lg data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="itinerary"
                className="text-lg data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
              >
                Itinerary
              </TabsTrigger>
              <TabsTrigger
                value="map"
                className="text-lg data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
              >
                Map
              </TabsTrigger>
            </TabsList>

            <div className="text-center">
              <Link href="/trips" onClick={() => handleNavigate("back")}>
                <Button className="button-hover bg-indigo-500 text-white hover:bg-indigo-500 px-6 py-2 rounded-lg">
                  {loadingButton == "back" ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <ChevronLeft />
                  )}
                  Back to Trips
                </Button>
              </Link>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6 text-foreground">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4"> Trip Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-6 w-6 mr-3 text-indigo-500" />
                    <div>
                      <p className="font-medium "> Dates</p>
                      <p className="text-sm">
                        {trip.startDate.toLocaleDateString()} -{" "}
                        {trip.endDate.toLocaleDateString()}
                        <br />
                        {`${Math.round(
                          (trip.endDate.getTime() - trip.startDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days(s)`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-3 text-indigo-500" />
                    <div>
                      <p> Destinations</p>
                      <p>
                        {" "}
                        {trip.locations.length}{" "}
                        {trip.locations.length === 1 ? "location" : "locations"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-72 rounded-lg overflow-hidden shadow">
                <Map itineraries={trip.locations} />
              </div>
              {trip.locations.length === 0 && (
                <div className="text-center p-4">
                  <p className="pb-3">Add locations to see them on the map.</p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button className="button-hover bg-indigo-500 text-white hover:bg-indigo-500 px-6 py-2 rounded-lg">
                      {" "}
                      <Plus className="mr-2 h-5 w-5" /> Add Location
                    </Button>
                  </Link>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-foreground leading-relaxed pl-5">
                  {trip.description}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="itinerary" className="space-y-6">
            <div className="flex justify-between items-center mb-4 pb-3">
              <h2 className="text-3xl font-semibold">
                {" "}
                Full Itinerary
                <span> </span>
                <span className="text-foreground-text-light text-lg max-w-2xl mx-auto">
                  (Drag and drop to reorder your destinations. Click the arrow
                  to view detailed descriptions)
                </span>
              </h2>
            </div>

            {trip.locations.length === 0 ? (
              <div className="text-center p-4 text-foreground">
                <p className="pb-3">
                  Add locations to see them on the itinerary.
                </p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button className="button-hover bg-indigo-500 text-white hover:bg-indigo-500 px-6 py-2 rounded-lg">
                    {" "}
                    <Plus className="mr-2 h-5 w-5" /> Add Location
                  </Button>
                </Link>
              </div>
            ) : (
              <SortableItinerary locations={trip.locations} tripId={trip.id} />
            )}
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <div className="h-72 rounded-lg overflow-hidden shadow">
              <Map itineraries={trip.locations} />
            </div>
            {trip.locations.length === 0 && (
              <div className="text-center p-4">
                <p className="pb-3">Add locations to see them on the map.</p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button className="button-hover bg-indigo-500 text-white hover:bg-indigo-500 px-6 py-2 rounded-lg">
                    {" "}
                    <Plus className="mr-2 h-5 w-5" /> Add Location
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
