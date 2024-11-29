import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

// Import the icon, may add more icon later
import customIconUrl from "../images/red-icon.png";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const [facilities, setFacilities] = useState([]);
  // Set initial position to be centered on campus
  const campusCoordinates = [37.583825, 127.060001];
  const zoomLevel = 17; //the larger the zoomLevel, more zoom in into map

  // facilities 데이터 가져오기
  useEffect(() => {
    fetch("./src/data/facilities.json") //index.html 기준의 path
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch facilities data");
        }
        return response.json();
      })
      .then((data) => setFacilities(data));
  }, []);

  // Define a custom icon for facilities
  const customIcon = new L.Icon({
    iconUrl: customIconUrl,
    iconSize: [36, 36],
    iconAnchor: [16, 32], //The coordinates of the "tip" of the icon (relative to its top left corner)
    popupAnchor: [0, -32], //The coordinates of the point from which popups will "open", relative to the icon anchor
  });

  return (
    <MapContainer
      center={campusCoordinates}
      zoom={zoomLevel}
      style={{ height: "calc(100dvh - 48px)", width: "100%" }}
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
      {facilities.map((facility) => (
        <Marker
          key={facility.id}
          position={facility.coordinates}
          icon={customIcon}
        >
          {/* 상세정보 */}
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
