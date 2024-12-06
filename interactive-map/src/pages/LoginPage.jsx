import { hasLength, isEmail, useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Button,
  Box,
  Title,
  Center,
  Notification,
} from "@mantine/core";


const LoginPage = () => {
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
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
        console.log("User info:", data);
        // 추후 토큰 저장 등
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    <Center w="100%" h="100vh">
      <Box
        w={{ base: "90%", sm: 500, lg: 600 }}
        py={{ base: "xs", sm: "md", lg: "xl" }}
      >
        <Title ta="center" order={1}>
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
