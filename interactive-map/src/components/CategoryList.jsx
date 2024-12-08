import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";

const CategoryList = ({ facilities, onCategoryFilter }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [imageSrcs, setImageSrcs] = useState({}); // 카테고리 이미지 경로 상태 관리

  // type[0] 분류하기
  const categories = useMemo(() => {
    const types = facilities.map((facility) => facility.type[0]);
    return Array.from(new Set(types)); // 중복 제거
  }, [facilities]);

  // 카테고리 선택 처리
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category) // 이미 선택된 경우 제거
        : [...prev, category] // 새로 선택된 경우 추가
    );
  };

  // 비동기로 이미지 불러오기
  const getImageForCategory = (type) => {
    const imageUrl = `/src/images/${type}-icon.png`; // type[0]에 대한 이미지 경로

    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => resolve(imageUrl);
      image.onerror = () => resolve(null); // 이미지가 없을 경우 null 반환
    });
  };

  useEffect(() => {
    const loadAllCategoryImages = async () => {
      const imagePromises = categories.map(async (category) => {
        const imageUrl = await getImageForCategory(category);
        return { category, url: imageUrl };
      });

      const imageResults = await Promise.all(imagePromises);
      const imageMap = imageResults.reduce((acc, { category, url }) => {
        acc[category] = url;
        return acc;
      }, {});

      setImageSrcs(imageMap);
    };

    loadAllCategoryImages();
  }, [categories]);

  return (
    <div className="category-list-container">
      <h3>Category</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {categories.map((category) => (
          <li
            key={category}
            className={`category-item ${
              selectedCategories.includes(category) ? "active" : ""
            }`}
            onClick={() => toggleCategory(category)}
            style={{
              display: 'flex', // flex를 사용하여 이미지와 텍스트 정렬
              alignItems: 'center',
              cursor: "pointer",
              padding: "10px",
              background: selectedCategories.includes(category) ? "#ddd" : "#fff",
              border: "1px solid #ccc",
              marginBottom: "5px",
              borderRadius: "4px",
            }}
          >
            {imageSrcs[category] && (
              <img 
                src={imageSrcs[category]} 
                alt={category} 
                style={{ width: '40px', height: '40px', marginRight: '10px' }} 
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <span>{category}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onCategoryFilter(selectedCategories)}
        style={{
          marginTop: "10px",
          width: "260px",
          padding: "8px 16px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        필터 적용
      </button>
    </div>
  );
};

CategoryList.propTypes = {
  facilities: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  onCategoryFilter: PropTypes.func.isRequired,
};

export default CategoryList;
