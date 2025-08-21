"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";

export interface TransformedLocation {
  lat: number;
  lng: number;
  name: string;
  country: string;
}

export default function GlobePage() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(
    new Set()
  );
  const [locations, setLocations] = useState<TransformedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/trips");
        const data = await response.json();
        setLocations(data);
        const countries = new Set<string>(
          data.map((loc: TransformedLocation) => loc.country)
        );

        setVisitedCountries(countries);
      } catch (err) {
        console.error("error", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 2;
    }
  }, []);
  return (
    <div className="min-h-screen pt-16">
      {" "}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-4xl font-bold mb-12 border-2 rounded-lg p-4">
            {" "}
            Your Travel Journey
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-black/40 backdrop-blur rounded-xl shadow-lg overflow-hidden text-foreground">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-500">
                  {" "}
                  See where you've been...
                </h2>

                <div className="h-[600px] w-full relative backdrop-blur pt-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900">
                        {" "}
                      </div>
                    </div>
                  ) : (
                    <Globe
                      ref={globeRef}
                      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                      backgroundColor="rgba(0,0,0,0)"
                      pointColor={() => "#FF5733"}
                      pointLabel="name"
                      pointsData={locations}
                      pointRadius={0.5}
                      pointAltitude={0.1}
                      pointsMerge={true}
                      width={800}
                      height={600}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 bg-black/40 backdrop-blur border-0 rounded-lg text-foreground">
              <Card className="sticky top-8 border-0">
                <CardHeader>
                  {" "}
                  <CardTitle> Countries Visited</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900">
                        {" "}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-indigo-400 p-4 rounded-lg">
                        <p className="text-md text-white ">
                          {" "}
                          You've visited{" "}
                          <span className="font-bold">
                            {" "}
                            {visitedCountries.size}
                          </span>{" "}
                          countries.
                        </p>
                      </div>

                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                        {Array.from(visitedCountries)
                          .sort()
                          .map((country, key) => (
                            <div
                              key={key}
                              className="flex items-center gap-2 p-3 rounded-lg hover: bg-indigo-400 transition-colors border border-indigo-800"
                            >
                              <MapPin className="h-4 w-4 text-red-500" />
                              <span className="font-medium"> {country}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
