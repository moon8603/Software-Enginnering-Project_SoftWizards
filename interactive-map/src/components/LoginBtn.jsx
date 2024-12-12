import { Button, Group } from '@mantine/core';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from 'react';
import useStore from "../store/forumStore";

const LoginBtn = () => {

  const isAdmin = useStore((state) => state.isAdmin);
  const setAdmin = useStore((state) => state.setAdmin);

  const adminEmail = "test@gmail.com";

  const [token, setToken] = useState(null);  // JWT 토큰을 상태로 관리
  const [decodedToken, setDecodedToken] = useState(null);  // 디코딩된 토큰을 상태로 관리

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      setToken(storedToken);  // 토큰 상태 업데이트
      setDecodedToken(decoded);  // 디코딩된 토큰 상태 업데이트

      // 관리자 이메일 검증
      if (decoded.email === adminEmail) {
        setAdmin(true);
      }
    }
  }, [setAdmin]);  // 컴포넌트 마운트 시 실행

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/loginpage");
  }

  const handleLogout = async () => {
    // 로컬스토리지에서 JWT 토큰을 삭제
    localStorage.removeItem("jwtToken");  // JWT 토큰 삭제

    // 상태 업데이트
    setAdmin(false);
    // 메인 페이지로 리디렉션
    navigate("/main");
    alert("로그아웃되었습니다.");
  };

  return (
    <Group>
      {!isAdmin && (
        <Button onClick={handleClick} style={{width: "120px"}} fz="md">
          
          로그인
        </Button>
      )}
    
      {isAdmin && (
        <Button onClick={handleLogout} fz="md" className='login-btn-text'>
          {/* <div className='fix-button'>
          {decodedToken ? 
          <div className="login-btn-text">{decodedToken.email}</div>
          : <div className="login-btn-text">이메일을 찾을 수 없습니다.</div>}
          <div className="login-btn-text">에서 로그아웃</div>
          </div> */}
          <div className="login-btn-text">
            {decodedToken ?
              <span>{decodedToken.email} </span> : <span>이메일을 찾을 수 없습니다.</span>
            }
            에서 로그아웃
          </div>
        </Button>
      )}
    </Group>
  )
}

export default LoginBtn