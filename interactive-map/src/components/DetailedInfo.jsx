import editIcon from '../images/edit-icon.png';
import useStore from "../store/forumStore";

const DetailedInfo = ({ facility, onEdit }) => {
  const isAdmin = useStore((state) => state.isAdmin);

  // 시설과 이름이 같고 일련번호가 0번인 사진을 가져옴
  const getImageForFacility = (name) => {
    // File format: name_0.jpeg
    const fileName = `${name}_0.jpeg`;
    return `./src/images/${fileName}`;
  };

  // URL 유효성 확인
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
    <div style={{ position: 'relative' }}>
      <div className='detailedinfo-div-div'>
        <h3 style={{ margin: 0 }}>{facility.name}</h3>
        {isAdmin && <img
          src={editIcon}
          alt="edit"
          className='detailedinfo-editicon'
          onClick={onEdit}
        />}
      </div>
      <p>{facility.description}</p>
      <p>Working Hours: {facility.workingHour}</p>

      {/* 시설 이미지 */}
      {getImageForFacility(facility.name) && (
        <img
            src={getImageForFacility(facility.name)}
            alt={facility.name}
            className='detailedinfo-facility-image'
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
            onClick={(e) => handleLinkClick(e, facility.link)}
          >
            {facility.link}
          </a>
        </p>
      )}

      
    </div>
  );
};

export default DetailedInfo;
