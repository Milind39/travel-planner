"use client";

import Globe from "react-globe.gl";
import { useEffect, useRef } from "react";

interface GlobeProps {
  locations: { lat: number; lng: number; locationTitle: string }[];
}

export default function GlobeView({ locations }: GlobeProps) {
  const globeRef = useRef<any>();

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 2000);
    }
  }, []);

  return (
    <div className="w-full h-[600px]">
      <Globe
        ref={globeRef}
        width={800}
        height={600}
        backgroundColor="#000"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        pointsData={locations}
        pointLat={(d: any) => d.lat}
        pointLng={(d: any) => d.lng}
        pointLabel={(d: any) => d.locationTitle}
        pointColor={() => "orange"}
        pointAltitude={0.02}
      />
    </div>
  );
}
