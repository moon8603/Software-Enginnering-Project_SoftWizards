import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

// Import the icon, may add more icon later
import customIconUrl from "../images/red-icon.png";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const [facilities, setFacilities] = useState([]);
  // Set initial position to be centered on campus
  const campusCoordinates = [37.583804, 127.058934];
  const zoomLevel = 17; //the larger the zoomLevel, more zoom in into map

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch("http://localhost:3000/main");
        if (!response.ok) {
          throw new Error("Failed to fetch facilities data");
        }
        const result = await response.json();
        console.log("Facilities data:", result);
        setFacilities(result.data); // Extract the data array
      } catch (error) {
        console.error("Error fetching facilities data:", error);
      }
    };

    fetchFacilities();
  }, []);

  // Define a custom icon for facilities
  const customIcon = new L.Icon({
    iconUrl: customIconUrl,
    iconSize: [60, 60],
    iconAnchor: [30, 60], //The coordinates of the "tip" of the icon (relative to its top left corner)
    popupAnchor: [0, -32], //The coordinates of the point from which popups will "open", relative to the icon anchor
  });

  return (
    <MapContainer
      center={campusCoordinates}
      zoom={zoomLevel}
      style={{ height: "100dvh", width: "calc(100dvw - 15dvw)" }}
    >
      {/* TileLayer: sets the map's look by fetching tiles from OpenStreetMap. */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxNativeZoom={20}
        minZoom={17}
        maxZoom={20}
      />

      {/* Render markers only when facilities data is loaded */}
      {Array.isArray(facilities) &&
        facilities.map((facility) => (
          <Marker
            key={facility.id}
            position={facility.coordinates.map((coord) => parseFloat(coord))} // Convert to numbers
            icon={customIcon}
          >
            <Popup>
              <h3>{facility.name}</h3>
              <p>{facility.description}</p>
              <p>Working Hours: {facility.workingHour}</p>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default Map;
