import {
    MapContainer,
    TileLayer,
    CircleMarker,
    useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function LocationMarker({ position, onLocationSelect }) {
    useMapEvents({
        async click(event) {
            const { lat, lng } = event.latlng;

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1&accept-language=en`
                );

                const data = await response.json();

                const address = data.address || {};

                const location =
                    address.city ||
                    address.town ||
                    address.village ||
                    address.municipality ||
                    address.county ||
                    "";

                onLocationSelect({
                    latitude: lat,
                    longitude: lng,
                    location,
                });
            } catch (error) {
                console.error(
                    "Failed to determine location:",
                    error
                );

                // Still update coordinates even if location lookup fails
                onLocationSelect({
                    latitude: lat,
                    longitude: lng,
                    location: "",
                });
            }
        },
    });

    if (!position) {
        return null;
    }

    return (
        <CircleMarker
            center={[position.latitude, position.longitude]}
            radius={8}
        />
    );
}

export default function MapPicker({
    latitude,
    longitude,
    onLocationSelect,
}) {
    const defaultPosition = [35.1856, 33.3823];

    const position =
        latitude !== null &&
        latitude !== "" &&
        longitude !== null &&
        longitude !== ""
            ? {
                  latitude: Number(latitude),
                  longitude: Number(longitude),
              }
            : null;

    const mapCenter = position
        ? [position.latitude, position.longitude]
        : defaultPosition;

    return (
        <MapContainer
            center={mapCenter}
            zoom={13}
            style={{
                height: "350px",
                width: "100%",
                borderRadius: "8px",
            }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker
                position={position}
                onLocationSelect={onLocationSelect}
            />
        </MapContainer>
    );
}