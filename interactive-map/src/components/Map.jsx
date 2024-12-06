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
  // Set initial position to be centered on campus
  const campusCoordinates = [37.583804, 127.058934];
  const zoomLevel = 17; //the larger the zoomLevel, more zoom in into map

  // Load facilities data
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        // const response = await fetch("./src/data/facilities.json");
        const response = await fetch("http://localhost:3000/main");
        console.log(response);
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

  // Define custom icons
  const icons = {
    red: new L.Icon({
      iconUrl: redIconUrl,
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -32],
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
    console.log("facility type: ", facility.type[0]);
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
    <MapContainer
      center={campusCoordinates}
      zoom={zoomLevel}
      style={{ height: "100dvh", width: "calc(100dvw - 15dvw)" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxNativeZoom={20}
        minZoom={17}
        maxZoom={20}
      />

      {/* Render markers */}
      {Array.isArray(facilities) &&
       facilities.map((facility) => (
        <Marker
          key={facility.id}
          position={facility.coordinates}
          icon={getIconForFacility(facility)}
        >
          <Popup>
            <h3>{facility.name}</h3>
            <p>{facility.description}</p>
            {/* 이 주석의 다음 코드는 json파일의 시설들의 description부분을 다 배열을 만들고 나서 사용할 거임. */}
            {/* {facility.description.map((descript) => (
              <p key={descript}>{descript}</p>
            ))} */}
            <p>Working Hours: {facility.workingHour}</p>
            {/* <img src="./src/images/red-icon.png" alt="" style={{ width: "100px", height: "100px" }}/> */}
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
                  onClick={(e) => handleLinkClick(e, facility.link)} // Handle link click
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
