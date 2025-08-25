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

const Map = dynamic(() => import("../map"), { ssr: false });

export default function TripDetailClient({ trip }: TripDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingButton, setLoadingButton] = useState<"add" | "back" | null>(
    null
  );

  const handleNavigate = (type: "add" | "back") => setLoadingButton(type);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 pt-24">
      {/* Image */}
      {trip.imageUrl && (
        <div className="w-full h-56 sm:h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative">
          <Image
            src={trip.imageUrl}
            alt={trip.title}
            className="object-cover"
            fill
            priority
          />
        </div>
      )}

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-0 p-4 sm:p-6 shadow rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-foreground flex-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold">
            {trip.title.toUpperCase()}
          </h1>

          <div className="flex items-center mt-2 text-sm sm:text-base">
            <Calendar className="h-5 w-5 mr-2" />
            <span>
              {trip.startDate.toLocaleDateString()} -{" "}
              {trip.endDate.toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
          <Link
            href={`/trips/${trip.id}/itinerary/new`}
            onClick={() => handleNavigate("add")}
            className="w-full sm:w-auto"
          >
            <Button className="button-hover bg-indigo-500 text-white hover:bg-indigo-600 px-4 py-2 rounded-lg flex items-center justify-center w-full">
              {loadingButton === "add" ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Plus className="mr-2 h-5 w-5" />
              )}
              Add Location
            </Button>
          </Link>

          <Link
            href="/trips"
            onClick={() => handleNavigate("back")}
            className="w-full sm:w-auto"
          >
            <Button className="button-hover bg-indigo-500 text-white hover:bg-indigo-600 px-4 py-2 rounded-lg flex items-center justify-center w-full">
              {loadingButton === "back" ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <ChevronLeft className="mr-2 h-4 w-4" />
              )}
              <span>Back to Trips</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-black/40 backdrop-blur-md border-0 text-foreground p-4 sm:p-6 shadow rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8 gap-4 sm:gap-0">
            <TabsList className="flex flex-wrap sm:flex-nowrap bg-gray-500 p-0 rounded-lg overflow-x-auto">
              <TabsTrigger
                value="overview"
                className="text-sm sm:text-lg data-[state=active]:bg-indigo-500 data-[state=active]:text-white flex-1 sm:flex-none text-center"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="itinerary"
                className="text-sm sm:text-lg data-[state=active]:bg-indigo-500 data-[state=active]:text-white flex-1 sm:flex-none text-center"
              >
                Itinerary
              </TabsTrigger>
              <TabsTrigger
                value="map"
                className="text-sm sm:text-lg data-[state=active]:bg-indigo-500 data-[state=active]:text-white flex-1 sm:flex-none text-center"
              >
                Map
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview */}
          <TabsContent
            value="overview"
            className="space-y-4 sm:space-y-6 text-foreground"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                  Trip Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="font-medium">Dates</p>
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
                  <div className="flex items-start gap-2 sm:gap-3">
                    <MapPin className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p>Destinations</p>
                      <p>
                        {trip.locations.length}{" "}
                        {trip.locations.length === 1 ? "location" : "locations"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-56 sm:h-72 md:h-96 rounded-lg overflow-hidden shadow">
                <Map itineraries={trip.locations} />
              </div>

              {trip.locations.length === 0 && (
                <div className="text-center p-4 col-span-full">
                  <p className="pb-3">Add locations to see them on the map.</p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button className="button-hover bg-indigo-500 text-white hover:bg-indigo-500 px-4 py-2 rounded-lg w-full sm:w-auto flex items-center justify-center">
                      <Plus className="mr-2 h-5 w-5" /> Add Location
                    </Button>
                  </Link>
                </div>
              )}
              <div className="col-span-full">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
                  Description
                </h2>
                <p className="text-foreground leading-relaxed pl-2 sm:pl-5 text-sm sm:text-base">
                  {trip.description}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Itinerary */}
          <TabsContent value="itinerary" className="space-y-4 sm:space-y-6 ">
            {trip.locations.length === 0 ? (
              <div className="text-center p-4 text-foreground">
                <p className="pb-3">
                  Add locations to see them on the itinerary.
                </p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button className="button-hover bg-indigo-500 text-white hover:bg-indigo-500 px-4 py-2 rounded-lg w-full sm:w-auto flex items-center justify-center">
                    <Plus className="mr-2 h-5 w-5" /> Add Location
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <SortableItinerary
                  locations={trip.locations}
                  tripId={trip.id}
                />
              </div>
            )}
          </TabsContent>

          {/* Map */}
          <TabsContent
            value="map"
            className="space-y-4 sm:space-y-6 text-xs sm:text-sm md:text-base"
          >
            <div className="h-56 sm:h-72 md:h-96 rounded-lg overflow-hidden shadow">
              <Map itineraries={trip.locations} />
            </div>
            {trip.locations.length === 0 && (
              <div className="text-center p-4 text-xs sm:text-sm md:text-base">
                <p className="pb-3">Add locations to see them on the map.</p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button className="button-hover bg-indigo-500 text-white hover:bg-indigo-500 px-4 py-2 rounded-lg w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm md:text-base">
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
