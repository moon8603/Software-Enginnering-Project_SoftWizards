import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Import the icon, may add more icon later
import customIconUrl from "../images/red-icon.png";
import "leaflet/dist/leaflet.css";

const Map = () => {
  // Set initial position to be centered on campus
  const campusCoordinates = [37.583825, 127.060001];
  const zoomLevel = 17; //the larger the zoomLevel, more zoom in into map

  const facilities = [
    {
      id: 1,
      name: "중앙도서관",
      coordinates: [37.584939, 127.062061],
      description: "Main Library",
    },
    {
      id: 2,
      name: "학생회관",
      coordinates: [37.58367, 127.059945],
      description: "Student Hall",
    },
  ];

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
      style={{ height: "90dvh", width: "100%" }}
    >
      {/* TileLayer: sets the map's look by fetching tiles from OpenStreetMap. */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxNativeZoom={20}
        maxZoom={20}
      />

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
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
