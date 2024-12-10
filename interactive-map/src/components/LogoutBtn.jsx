import { Button } from '@mantine/core';
import { useNavigate } from "react-router-dom";
import useStore from '../store/forumStore';

const LogoutBtn = () => {
  const setAdmin = useStore((state) => state.setAdmin); // Zustand action to set admin state
  const isAdmin = useStore((state) => state.isAdmin);

  const navigate = useNavigate();

  const handleClick = () => {
    setAdmin(!isAdmin);
    navigate("/main");
  }

  return (
    <Button onClick={handleClick} style={{width: "120px"}} bg="green"> {/* 필터 버튼을 제거함에 따라 크기 수정 80 --> 120 */}
      로그아웃
    </Button>
  )
}

export default LogoutBtn
