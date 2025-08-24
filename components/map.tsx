"use client";

import { Location } from "@/app/generated/prisma";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  itineraries: Location[];
}

// Fix Leaflet marker icons
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Map({ itineraries }: MapProps) {
  // ✅ Filter out invalid locations
  const validItineraries = itineraries.filter(
    (loc) =>
      typeof loc.lat === "number" &&
      !isNaN(loc.lat) &&
      typeof loc.lng === "number" &&
      !isNaN(loc.lng)
  );

  const center =
    validItineraries.length > 0
      ? { lat: validItineraries[0].lat, lng: validItineraries[0].lng }
      : { lat: 0, lng: 0 };

  return (
    <MapContainer
      key={validItineraries ? JSON.stringify(validItineraries) : "default"}
      center={center}
      zoom={validItineraries.length > 0 ? 12 : 2} // zoom out if no valid data
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {validItineraries.length > 0 ? (
        validItineraries.map((location, key) => (
          <Marker key={key} position={{ lat: location.lat, lng: location.lng }}>
            <Popup>
              <strong>{location.locationTitle}</strong>
              <br />
              Lat: {location.lat}, Lng: {location.lng}
            </Popup>
          </Marker>
        ))
      ) : (
        // Default fallback marker
        <Marker position={[51.505, -0.09]}>
          <Popup>No valid locations to display.</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
