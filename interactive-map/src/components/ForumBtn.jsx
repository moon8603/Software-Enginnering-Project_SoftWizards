import { Button } from '@mantine/core'
import { useNavigate } from "react-router-dom";


const ForumBtn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/forumpage");
  }

  return (
    <Button onClick={handleClick} style={{width: "120px"}}> {/* 필터 버튼을 제거함에 따라 크기 수정 80 --> 120 */}
      게시판
    </Button>
  )
}

export default ForumBtn