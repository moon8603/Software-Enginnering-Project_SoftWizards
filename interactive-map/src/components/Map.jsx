import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

// Import the icons
import redIconUrl from "../images/red-icon.png";
import greenIconUrl from "../images/green-icon.png";
import blueIconUrl from "../images/blue-icon.png";
import orangeIconUrl from "../images/orange-icon.png";
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
  const icons = {
    red: new L.Icon({
      iconUrl: redIconUrl,
      iconSize: [36, 36],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    }),
    green: new L.Icon({
      iconUrl: greenIconUrl,
      iconSize: [36, 36],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    }),
    blue: new L.Icon({
      iconUrl: blueIconUrl,
      iconSize: [36, 36],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    }),
    orange: new L.Icon({
      iconUrl: orangeIconUrl,
      iconSize: [36, 36],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    }),
    grey: new L.Icon({
      iconUrl: greyIconUrl,
      iconSize: [36, 36],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    }),
  };

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
      return icons.grey; // Outside working hours
    }

    switch (facility.type[0]) {
      case "기본 편의 시설":
        return icons.red;
      case "휴식 및 복지 편의 시설":
        return icons.green;
      case "스포츠 편의 시설":
        return icons.blue;
      case "기타 시설":
        return icons.orange;
      default:
        return icons.grey; // Default fallback
    }
  };

  // Function to get the image path based on facility name and ID
  const getImageForFacility = (name) => {
    // File format: name_0.jpeg
    const fileName = `${name}_0.jpeg`;
    return `./src/images/${fileName}`;
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
            {/* Match and display the image */}
            {getImageForFacility(facility.name) && (
              <img
                src={getImageForFacility(facility.name)}
                alt={facility.name}
                style={{ width: "100%", height: "auto", marginTop: "10px" }}
                onError={(e) => (e.target.style.display = "none")} // 이미지 로드 실패 시 숨기기
              />
            )}
            {/* Display link as URL */}
            {facility.link && (
              <p>
                <a
                  href={facility.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  {facility.link}
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
