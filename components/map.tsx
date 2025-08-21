"use client";

import { Location } from "@/app/generated/prisma";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  itineraries: Location[];
}

// Fix Leaflet marker icons (otherwise they might not show properly in Next.js)
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
  const center =
    itineraries.length > 0
      ? { lat: itineraries[0].lat, lng: itineraries[0].lng }
      : { lat: 0, lng: 0 };

  return (
    <MapContainer
      key={itineraries ? JSON.stringify(itineraries) : "default"}
      center={center}
      zoom={itineraries.length > 0 ? 6 : 13} // ✅ zoomed in if data exists
      style={{ width: "100%", height: "100%" }}
    >
      {/* ✅ OpenStreetMap tiles (same as vanilla example) */}
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* ✅ Add markers */}
      {itineraries.length > 0 ? (
        itineraries.map((location, key) => (
          <Marker key={key} position={{ lat: location.lat, lng: location.lng }}>
            <Popup>
              <strong>{location.locationTitle}</strong>
              <br />
              Lat: {location.lat}, Lng: {location.lng}
            </Popup>
          </Marker>
        ))
      ) : (
        // ✅ Example default marker (like your vanilla JS code)
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS popup.
            <br />
            Easily customizable.
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
