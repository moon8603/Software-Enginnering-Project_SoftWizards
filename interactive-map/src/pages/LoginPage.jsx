import { hasLength, isEmail, useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Button,
  Box,
  Title,
  Center,
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

  return (
    <Center w="100%" h="100vh">
      <Box
        w={{ base: "90%", sm: 500, lg: 600 }}
        py={{ base: "xs", sm: "md", lg: "xl" }}
      >
        <Title ta="center" order={1}>
          로그인
        </Title>
        <form onSubmit={form.onSubmit()}>
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
            // description="password at least 8 characters"
            {...form.getInputProps("password")}
            required
          />
          <Button type="submit" fullWidth mt="xl" size="xl" className="login-btn">
            로그인
          </Button>
        </form>
      </Box>
    </Center>
  );
}

export default LoginPage

