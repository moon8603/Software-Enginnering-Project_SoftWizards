import PostLine from '../components/PostLine';
import PostDetail from '../components/PostDetail';
import { Container, Title, Box, ActionIcon} from '@mantine/core';
import { useNavigate, useSearchParams } from "react-router-dom";
import { RiCloseLargeLine } from "react-icons/ri";


const ForumPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const handleCloseButton = () => {
    navigate("/main");
  };

  const postId = searchParams.get("id");

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
        {postId ? (
          < PostDetail postId={postId} /> // Show PostDetail if id is provided in the query string
          
        ) : (
          <PostLine /*posts={posts}*/ /> // Show PostLine if no id is provided
        )}
      </Box>
    </Container>
  );
};

export default ForumPage;
