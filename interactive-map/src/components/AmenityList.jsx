// src/components/AmenityList.jsx
import { useEffect, useState } from "react";

const AmenityList = ({ onFacilitiesFetched }) => {
  const [facilities, setFacilities] = useState([]);

  // facilities.json에서 데이터를 가져오기
  useEffect(() => {
    fetch("./src/data/facilities.json")
      .then((response) => response.json())
      .then((data) => {
        setFacilities(data);
        if (onFacilitiesFetched) {
          onFacilitiesFetched(data); // 데이터를 부모 컴포넌트로 전달
        }
      })
      .catch((error) => console.error("Failed to fetch facilities:", error));
  }, []);

  return (
    <div className="facility-list-container">
      <h3>시설 목록</h3>
      <div className="facility-list">
        {facilities.map((facility) => (
          <div className="facility-item" key={facility.id}>
            <h4>{facility.name}</h4>
            <p>{facility.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenityList;
