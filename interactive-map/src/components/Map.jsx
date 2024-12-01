import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

// Import the icons
import blueIconUrl from "../images/blue-icon.png";
import redIconUrl from "../images/red-icon.png";
import greyIconUrl from "../images/grey-icon.png";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const [facilities, setFacilities] = useState([]);
  const campusCoordinates = [37.583825, 127.060001];
  const zoomLevel = 17;

  // Load facilities data
  useEffect(() => {
    fetch("./src/data/facilities.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch facilities data");
        }
        return response.json();
      })
      .then((data) => setFacilities(data));
  }, []);

  // Define custom icons
  const blueIcon = new L.Icon({
    iconUrl: blueIconUrl,
    iconSize: [36, 36],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const redIcon = new L.Icon({
    iconUrl: redIconUrl,
    iconSize: [36, 36],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const greyIcon = new L.Icon({
    iconUrl: greyIconUrl,
    iconSize: [36, 36],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Function to check if current time is within working hours
  const isWithinWorkingHours = (workingHour) => {
    const [start, end] = workingHour.split(" ~ ").map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return new Date().setHours(hours, minutes, 0);
    });

    const now = new Date().getTime();
    return now >= start && now <= end;
  };

  // Function to select the appropriate icon
  const getIconForFacility = (facility) => {
    if (!isWithinWorkingHours(facility.workingHour)) {
      return greyIcon; // Outside working hours
    }
    if (facility.type.includes("건물")) {
      return redIcon; // Building type
    }
    if (facility.type.includes("시설")) {
      return blueIcon; // Facility type
    }
    return greyIcon; // Default fallback
  };

  // Function to get the image path based on facility ID
  const getImageForFacility = (id) => {
    // Assuming all image files follow the "info_n.jpeg" naming format
    const imageFiles = ["building_1.jpeg", "cafe_3.jpeg"]; // Example list from the provided folder

    // Find the file where the number after "_" matches the facility ID
    const matchedFile = imageFiles.find((file) => {
      const [, number] = file.split("_"); // Split by "_"
      const [n] = number.split("."); // Extract the number part before "."
      return parseInt(n, 10) === id; // Match with the facility ID
    });

    return matchedFile ? `./src/images/${matchedFile}` : null; // Return the full path or null if not found
  };

  return (
    <MapContainer
      center={campusCoordinates}
      zoom={zoomLevel}
      style={{ height: "90dvh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxNativeZoom={20}
        maxZoom={20}
      />

      {/* Render markers */}
      {facilities.map((facility) => (
        <Marker
          key={facility.id}
          position={facility.coordinates}
          icon={getIconForFacility(facility)}
        >
          <Popup>
            <h3>{facility.name}</h3>
            <p>{facility.description}</p>
            <p>Working Hours: {facility.workingHour}</p>
            {/* ID와 매칭된 이미지 */}
            {getImageForFacility(facility.id) && (
              <img
                src={getImageForFacility(facility.id)}
                alt={facility.name}
                style={{ width: "100%", height: "auto", marginTop: "10px" }}
              />
            )}
            {/* 링크 표시 */}
            {facility.link && (
              <p>
                <a
                  href={facility.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  자세히 보기
                </a>
              </p>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
