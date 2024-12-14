import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Button } from "@mantine/core";

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
    setSelectedCategories(
      (prev) =>
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
    <>
      <h3 className="category-list-h3">Category</h3>
      <div className="category-list-container">
        <ul>
          {categories.map(
            (category) =>
              !category && alert("오류 발생했습니다. 다시 시도해주세요")
          )}
          {categories.map((category) => (
            <li
              key={category}
              className={`category-item ${
                selectedCategories.includes(category) ? "active" : ""
              }`}
              onClick={() => toggleCategory(category)}
              style={{
                background: selectedCategories.includes(category)
                  ? "#ddd"
                  : "#fff",
              }}
            >
              {imageSrcs[category] && (
                <img
                  src={imageSrcs[category]}
                  alt={category}
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              <span>{category}</span>
            </li>
          ))}
        </ul>
        <Button
          onClick={() => onCategoryFilter(selectedCategories)}
          fullWidth
          mt="sm"
          variant="outline"
        >
          필터 적용
        </Button>
      </div>
    </>
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