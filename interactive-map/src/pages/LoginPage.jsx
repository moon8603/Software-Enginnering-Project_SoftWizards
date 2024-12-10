import { hasLength, isEmail, useForm } from "@mantine/form";
import {  useNavigate  } from 'react-router-dom'
import {
  TextInput,
  PasswordInput,
  Button,
  Box,
  Title,
  Center,
  Text,
  ActionIcon
} from "@mantine/core";
import { RiCloseLargeLine } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";
import useStore from "../store/forumStore";

const LoginPage = () => {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Invalid email"),
      password: hasLength({ min: 8 }, "Password must be at least 8 characters"),
    },
  });

  // 백엔드 연동 part
  const handleClick = async (values) => {
    try {
      const response = await fetch("http://localhost:3000/loginpage/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      const data = await response.json();

    if (data.token) {
      // 로컬 스토리지에 토큰 저장
      localStorage.setItem("jwtToken", data.token);

      // 토큰 디코딩하여 isAdmin 정보 추출
      const decodedToken = jwtDecode(data.token);
      const isAdmin = decodedToken.isAdmin;

      // useStore 상태 업데이트
      useStore.getState().setAdmin(isAdmin);
      alert("로그인 성공");
      navigate("/main");
    } else {
      console.log("로그인 실패");
    }
  } catch (error) {
    console.error("로그인 에러:", error);
  }
};
      

  const handleCloseButton = () => {
    navigate("/main");
  }

  return (
    <Center w="100%" h="100vh">
      <Box
        w={{ base: "90%", sm: 500, lg: 600 }}
        py={{ base: "xs", sm: "md", lg: "xl" }}
      >
        <div className="loginpage-center-box-div">
          <ActionIcon onClick={() => handleCloseButton()} size="lg" variant="outline">
            <RiCloseLargeLine size={28}/>
          </ActionIcon>
        </div>
        <Title ta="center" order={1} mb={40}>
          로그인
        </Title>
        <form onSubmit={form.onSubmit(handleClick)}>
          <TextInput
            label="아이디"
            placeholder="아이디"
            size="xl"
            aria-label="아이디 입력"
            {...form.getInputProps("email")}
            required
          />
          <PasswordInput
            label="비밀번호"
            placeholder="비밀번호"
            mt="md"
            size="xl"
            aria-label="비밀번호 입력"
            {...form.getInputProps("password")}
            required
          />
          <Text c="dimmed" mt="xs">관리자만 로그인할 수 있습니다</Text>
          <Button
            type="submit"
            fullWidth
            mt="xl"
            size="xl"
            className="login-btn"
          >
            로그인
          </Button>
        </form>
      </Box>
    </Center>
  );
};

export default LoginPage;
