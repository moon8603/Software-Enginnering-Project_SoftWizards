import { useEffect, useState } from 'react';

const EditModal = ({ facility, onClose, onApply, onDelete, facilityList = [] }) => {
  const [formData, setFormData] = useState(facility);

  // facility가 변경될 때마다 formData를 새롭게 업데이트
  useEffect(() => {
    setFormData(facility);
  }, [facility]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateFormData = () => {
    const { name, type, workingHour } = formData;
    const namePattern = /^\s*$/;
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d) ~ ([01]\d|2[0-3]):([0-5]\d)$/;

    if (namePattern.test(name)) {
      alert('시설 이름을 입력해주세요.');
      return false;
    }

    if (facilityList.some(facility => facility.name === name)) {
      alert('이미 존재하는 시설 이름과 중복될 수 없습니다.');
      return false;
    }

    const typeList = facilityList.map(facility => facility.type[0]);
    if (!type || !typeList.includes(type)) {
      alert('유효하지 않은 유형입니다.');
      return false;
    }

    if (!timePattern.test(workingHour)) {
      alert('운영 시간은 "00:00 ~ 02:35"와 같은 형태여야 합니다.');
      return false;
    }

    return true;
  };

  // "적용" 버튼 클릭 시 확인 메시지
  const handleApplyClick = async () => {
    if (!validateFormData()) {
      return;
    }
    const confirmApply = window.confirm('정말 적용하시겠습니까?');
    if (confirmApply) {
      //onApply(formData);
      
      try {
        // 서버에 수정된 데이터 보내기
        const response = await fetch(`http://localhost:3000/main/update?id=${facility.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData), // 수정된 데이터
        });

        if (!response.ok) {
          throw new Error('시설 수정에 실패했습니다.');
        }

        const updatedFacility = await response.json();
        //onApply(updatedFacility);  // 수정된 데이터를 부모 컴포넌트로 전달하여 업데이트
        alert('시설이 성공적으로 수정되었습니다.');
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert('시설 수정에 실패했습니다.');
      }

    }
  };
  // "삭제" 버튼 클릭 시 확인 메시지
  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (confirmDelete) {
      //onDelete(facility.id);
      try {
        // 서버에 삭제 요청 보내기
        const response = await fetch(`http://localhost:3000/main/delete?id=${facility.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('시설 삭제에 실패했습니다.');
        }

        //onDelete(facility.id);  // 삭제된 시설 ID를 부모 컴포넌트로 전달하여 목록에서 삭제
        alert('시설이 성공적으로 삭제되었습니다.');
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert('시설 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {facility ? (
          <h2>시설 수정</h2>
        ) : (
          <h2>시설 추가</h2>
        )}

        {/* 이름 수정 */}
        <label>이름</label>
        <input 
          type="text" 
          value={formData?.name || ''} 
          onChange={e => handleInputChange('name', e.target.value)} 
        />

        {/* 좌표 추가*/}
        {!facility && 
        <>
          <label>좌표</label>
          <input 
            type="text" 
            value={formData?.coordinates || ''} 
            onChange={e => handleInputChange('coordinates', e.target.value)} 
          />
        </>
        }

        {/* 타입 수정 */}
        <label>타입</label>
        <input 
          type="text" 
          value={formData?.type?.[0] || ''} 
          onChange={e => handleInputChange('type', [e.target.value, formData?.type[1]])} 
        />

        {/* 운영 시간 수정 */}
        <label>운영 시간</label>
        <input 
          type="text" 
          value={formData?.workingHour || ''} 
          onChange={e => handleInputChange('workingHour', e.target.value)} 
        />

        {/* 설명 수정 */}
        <label>설명</label>
        <textarea 
          value={formData?.description || ''} 
          onChange={e => handleInputChange('description', e.target.value)} 
          rows="3"
          style={{ width: '100%' }}
        />

        {/* 링크 수정 */}
        <label>링크</label>
        <input 
          type="text" 
          value={formData?.link || ''} 
          onChange={e => handleInputChange('link', e.target.value)} 
        />

        {/* 버튼 */}
        <div className="modal-buttons">
          {facility ? (
            <button onClick={handleApplyClick}>적용</button>
          ) : (
            <button>추가</button>            
          )}
          {facility && <button onClick={handleDeleteClick}>삭제</button>}
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;