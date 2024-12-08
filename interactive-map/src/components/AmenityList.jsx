import { useEffect, useState } from 'react';

const AmenityList = ({ facilities }) => {
  const [imageSrcs, setImageSrcs] = useState({});

  const isWithinWorkingHours = (workingHours) => {
    if (!workingHours) return false;

    const now = new Date();

    const timeRanges = workingHours
      .split(", ")
      .map((range) => {
        const match = range.match(/(\d{1,2}:\d{2}) ~ (\d{1,2}:\d{2})/);
        if (!match) return null;

        const [start, end] = match.slice(1).map((time) => {
          const [hours, minutes] = time.split(":").map(Number);
          const date = new Date();
          date.setHours(hours, minutes, 0);
          return date.getTime();
        });

        return { start, end };
      })
      .filter(Boolean);

    return timeRanges.some(
      ({ start, end }) => now.getTime() >= start && now.getTime() <= end
    );
  };

  const getImageForFacility = (name, type) => {
    const primaryImage = `./src/images/${name}_0.jpeg`; // 1순위
    const secondaryImage = `./src/images/${type[1]}-icon.png`;  // 2순위
    const fallbackImage = `./src/images/${type[0]}-icon.png`; // 3순위

    return new Promise((resolve) => {
      const image = new Image();
      image.src = primaryImage;
      image.onload = () => resolve(primaryImage);
      image.onerror = () => {
        const secondaryImageTest = new Image();
        secondaryImageTest.src = secondaryImage;
        secondaryImageTest.onload = () => resolve(secondaryImage);
        secondaryImageTest.onerror = () => resolve(fallbackImage);
      };
    });
  };

  useEffect(() => {
    const loadAllImages = async () => {
      const imagePromises = facilities.map(async (facility) => {
        const imageUrl = await getImageForFacility(facility.name, facility.type);
        return { id: facility.id, url: imageUrl };
      });

      const imageResults = await Promise.all(imagePromises);
      const imageMap = imageResults.reduce((acc, { id, url }) => {
        acc[id] = url;
        return acc;
      }, {});

      setImageSrcs(imageMap);
    };

    loadAllImages();
  }, [facilities]);

  return (
    <div className="facility-list-container">
      <h3>시설 목록</h3>
      <div className="facility-list">
        {facilities.map((facility) => {
          const isOpen = isWithinWorkingHours(facility.workingHour);
          const imageSrc = imageSrcs[facility.id]; // 미리 불러온 이미지 URL 사용

          return (
            <div className="facility-item" key={facility.id} style={{ display: 'flex', alignItems: 'center' }}>
              {imageSrc && (
                <img 
                  src={imageSrc} 
                  alt={facility.name} 
                  style={{ width: '50px', height: '50px', marginRight: '10px' }} 
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <div>
                <h4>
                  <span>{facility.name}&nbsp;</span>
                  <span style={{ color: isOpen ? "green" : "red"}}>
                    ({isOpen ? "open" : "closed"})
                  </span>
                </h4>
                <p>{facility.type[0]}</p>
                <p>{facility.type[1]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AmenityList;
