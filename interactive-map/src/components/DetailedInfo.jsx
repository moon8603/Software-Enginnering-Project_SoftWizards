import editIcon from '../images/edit-icon.png';

const DetailedInfo = ({ facility, onEdit }) => {
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
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>{facility.name}</h3>
        {/* <img
          src={editIcon}
          alt="edit"
          style={{
            width: "18px",
            height: "18px",
            marginLeft: "10px",
            marginBottom: "2.5px",
            cursor: "pointer"
          }}
          onClick={onEdit}
        /> */}
      </div>
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
