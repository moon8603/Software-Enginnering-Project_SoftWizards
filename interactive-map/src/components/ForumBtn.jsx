import { Button } from '@mantine/core'
import { useNavigate } from "react-router-dom";


const ForumBtn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/forumpage");
  }

  return (
    <Button onClick={handleClick} style={{width: "80px"}}>
      게시판
    </Button>
  )
}

export default ForumBtn
