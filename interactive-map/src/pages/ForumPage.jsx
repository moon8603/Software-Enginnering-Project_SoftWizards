import PostLine from '../components/PostLine';
import { Container, Title, Box, ActionIcon} from '@mantine/core';
import { useNavigate } from "react-router-dom";
import { RiCloseLargeLine } from "react-icons/ri";


const ForumPage = () => {
  const navigate = useNavigate();
  const handleCloseButton = () => {
    navigate("/main");
  };

  return (
    <Container size="md" padding="lg">
      {/* Page Title */}
      <Box mb="lg">
        <div className="forumpage-container-box-div">
          <ActionIcon
            onClick={() => handleCloseButton()}
            size="lg"
            variant="outline"
          >
            <RiCloseLargeLine size={28} />
          </ActionIcon>
        </div>
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
