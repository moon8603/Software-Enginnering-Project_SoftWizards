// import { useEffect, useState } from "react";

const AmenityList = ({ facilities }) => {
  // 현재 운영 시간인지 확인하는 함수
  const isWithinWorkingHours = (workingHours) => {
    if (!workingHours) return false;

    const now = new Date();

    const timeRanges = workingHours
      .split(", ") // 여러 시간 범위를 분리
      .map((range) => {
        const match = range.match(/(\d{1,2}:\d{2}) ~ (\d{1,2}:\d{2})/); // 시간 범위 추출
        if (!match) return null;

        const [start, end] = match.slice(1).map((time) => {
          const [hours, minutes] = time.split(":").map(Number);
          const date = new Date();
          date.setHours(hours, minutes, 0);
          return date.getTime();
        });

        return { start, end };
      })
      .filter(Boolean); // 유효하지 않은 값 제거

    // 운영 시간 내에 있는지 확인
    return timeRanges.some(
      ({ start, end }) => now.getTime() >= start && now.getTime() <= end
    );
  };

  return (
    <div className="facility-list-container">
      <h3>시설 목록</h3>
      <div className="facility-list">
        {facilities.map((facility) => {
          const isOpen = isWithinWorkingHours(facility.workingHour);

          return (
            <div className="facility-item" key={facility.id}>
              <h4>
                <span>{facility.name}</span>
                <span style={{ color: isOpen ? "green" : "red" }}>
                    &nbsp;({isOpen ? "open" : "closed"})
                </span>
              </h4>
              <p>{facility.type[0]}</p>
              <p>{facility.type[1]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AmenityList;
