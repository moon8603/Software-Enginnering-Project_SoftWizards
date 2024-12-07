import { useMemo } from "react";
import PropTypes from "prop-types";

const CategoryList = ({ facilities, onCategorySelect, activeCategory }) => {
  // 고유한 카테고리 추출
  const categories = useMemo(() => {
    const types = facilities.map((facility) => facility.type[0]);
    return Array.from(new Set(types)); // 중복 제거
  }, [facilities]);

  return (
    <div className="category-list-container">
    {/* <div className="category-list-container"> */}
      <h3>Category</h3>
      <div className="facility-list">
        <ul style={{ listStyleType: "none"}}>
          {categories.map((category) => (
            <li
              key={category}
              className={`facility-item ${activeCategory === category ? "active" : ""}`}
              onClick={() => onCategorySelect(category === activeCategory ? null : category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

CategoryList.propTypes = {
  facilities: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  onCategorySelect: PropTypes.func.isRequired,
  activeCategory: PropTypes.string,
};

CategoryList.defaultProps = {
  activeCategory: null,
};

export default CategoryList;
