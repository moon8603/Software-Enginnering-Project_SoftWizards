import PostLine from '../components/PostLine';
import { Container, Title, Box} from '@mantine/core';

const ForumPage = () => {
  return (
    <Container size="md" padding="lg">
      {/* Page Title */}
      <Box mb="lg">
        <Title align="center" order={1} mt={60} className='forum-main-page'>
          게시판
        </Title>
      </Box>


      {/* Posts Section */}
      <Box>
        <PostLine />
      </Box>
    </Container>
  );
};

export default ForumPage;
