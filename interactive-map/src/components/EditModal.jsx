import { useEffect, useState } from 'react';

const EditModal = ({ facility, onClose, onApply, onDelete }) => {
  const [formData, setFormData] = useState(facility);

  // facility가 변경될 때마다 formData를 새롭게 업데이트
  useEffect(() => {
    setFormData(facility);
  }, [facility]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // "적용" 버튼 클릭 시 확인 메시지
  const handleApplyClick = () => {
    const confirmApply = window.confirm('정말 적용하시겠습니까?');
    if (confirmApply) {
      onApply(formData);
    }
  };
  // "삭제" 버튼 클릭 시 확인 메시지
  const handleDeleteClick = () => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (confirmDelete) {
      onDelete(facility.id);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>시설 수정</h2>

        {/* 이름 수정 */}
        <label>이름</label>
        <input 
          type="text" 
          value={formData?.name || ''} 
          onChange={e => handleInputChange('name', e.target.value)} 
        />

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
          <button onClick={handleApplyClick}>적용</button>
          <button onClick={handleDeleteClick}>삭제</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;