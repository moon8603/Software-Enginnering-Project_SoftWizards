import { Button } from '@mantine/core';
import { useNavigate } from "react-router-dom";


const LoginBtn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/loginpage");
  }

  return (
    <Button onClick={handleClick} style={{width: "120px"}}>
      로그인
    </Button>
  )
}

export default LoginBtn
