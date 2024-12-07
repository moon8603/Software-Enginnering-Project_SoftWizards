import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import AmenityList from "./AmenityList";
import CategoryList from "./CategoryList";

// Import the icons, may add more icon later
import redIconUrl from "../images/red-icon.png";
import greenIconUrl from "../images/green-icon.png";
import blueIconUrl from "../images/blue-icon.png";
import orangeIconUrl from "../images/orange-icon.png";
import greyIconUrl from "../images/grey-icon.png";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const [facilities, setFacilities] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  // Set initial position to be centered on campus
  const campusCoordinates = [37.583804, 127.058934];
  const zoomLevel = 17; //the larger the zoomLevel, more zoom in into map

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

  // Define a custom icon for facilities
  // -->
  // Define custom icons
  const icons = {
    red: new L.Icon({
      iconUrl: redIconUrl,
      iconSize: [60, 60],
      iconAnchor: [30, 60], //The coordinates of the "tip" of the icon (relative to its top left corner)
      popupAnchor: [0, -32], //The coordinates of the point from which popups will "open", relative to the icon anchor
    }),
    green: new L.Icon({
      iconUrl: greenIconUrl,
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -32],
    }),
    blue: new L.Icon({
      iconUrl: blueIconUrl,
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -32],
    }),
    orange: new L.Icon({
      iconUrl: orangeIconUrl,
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -32],
    }),
    grey: new L.Icon({
      iconUrl: greyIconUrl,
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -32],
    }),
  };

  const isWithinWorkingHours = (workingHours) => {
    const now = new Date();
  
    // Split workingHours string into multiple time ranges
    const timeRanges = workingHours
      .split(", ") // 여러 시간 범위를 분리
      .map((range) => {
        // 시간 정보만 추출 (예: "카페: 09:00 ~ 18:30" → "09:00 ~ 18:30")
        const match = range.match(/(\d{1,2}:\d{2}) ~ (\d{1,2}:\d{2})/); // 운영 시간 추출
        if (!match) return null; // 유효하지 않은 형식은 무시
  
        const [start, end] = match.slice(1).map((time) => {
          const [hours, minutes] = time.split(":").map(Number);
          const date = new Date();
          date.setHours(hours, minutes, 0);
          return date.getTime();
        });
  
        return { start, end };
      })
      .filter(Boolean);
  
    // 두 개의 운영 시간 중 하나만 만족해도 됨
    return timeRanges.some(
      ({ start, end }) => now.getTime() >= start && now.getTime() <= end
    );
  };
  

  // Function to select the appropriate icon
  const getIconForFacility = (facility) => {
    if (!isWithinWorkingHours(facility.workingHour)) {
      return icons.grey;
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
        return icons.grey; // Default
    }
  };

  // 시설과 이름이 같고 일련번호가 0번인 사진을 가져옴
  const getImageForFacility = (name) => {
    // File format: name_0.jpeg
    const fileName = `${name}_0.jpeg`;
    return `./src/images/${fileName}`;
  };

  // Function to validate a URL
  const isValidUrl = (url) => {
    try {
      new URL(url); // Throws if invalid
      return true;
    } catch {
      return false;
    }
  };

  // Handle link click
  const handleLinkClick = (event, url) => {
    if (!isValidUrl(url)) {
      event.preventDefault(); // Prevent navigation
      alert("Invalid Link"); // Show error message
    }
  };

  return (
    <>
      {/* 시설 목록을 우측 탭에 표시 */}
      <AmenityList facilities={facilities} />
      <CategoryList 
        facilities={facilities} 
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
      />

      <MapContainer
        center={campusCoordinates}
        zoom={zoomLevel}
        style={{ height: "100dvh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxNativeZoom={20}
          minZoom={17}
          maxZoom={20}
        />

        {/* 시설 목록을 마커로 표시 */}
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

              {/* 시설 이미지 */}
              {getImageForFacility(facility.name) && (
                <img
                  src={getImageForFacility(facility.name)}
                  alt={facility.name}
                  style={{ width: "100%", height: "auto", marginTop: "10px" }}
                  onError={(e) => (e.target.style.display = "none")} // 이미지 로드 실패 시 숨기기
                />
              )}

              {/* 링크 */}
              {facility.link && (
                <p>
                  <a
                    href={facility.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", textDecoration: "underline" }}
                    onClick={(e) => handleLinkClick(e, facility.link)} // 링크 클릭 시 처리
                  >
                    {facility.link}
                  </a>
                </p>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default Map;
