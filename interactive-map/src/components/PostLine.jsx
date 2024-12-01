import { useState, useEffect } from "react";
import PostDetail from "./PostDetail";
import {
  Card,
  Text,
  Title,
  Group,
  Container,
  Stack,
  Center,
  Button,
  Modal,
  Textarea,
  TextInput,
} from "@mantine/core";
import useStore from "../store/store";

const PostLine = () => {
  const [posts, setPosts] = useState([]); // State for posts
  const { currentUser, setCurrentUser } = useStore();
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // States for user input in the modal
  const [newPostAuthor, setNewPostAuthor] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  // Fetch posts from mock data
  useEffect(() => {
    fetch("./src/mock/mockPosts.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts data");
        }
        return response.json();
      })
      .then((data) => setPosts(data))
      .catch((error) => console.error(error));
  }, []);

  // Handle title click
  const handleTitleClick = (post) => {
    setSelectedPost(post); // Set the selected post for detail view
  };

  // Handle "글 작성" button click
  const handleNewPostSubmit = () => {
    if (newPostTitle.trim() && newPostContent.trim() && newPostAuthor.trim()) {
      const newPost = {
        id: posts.length + 1,
        title: newPostTitle,
        content: newPostContent,
        author: newPostAuthor,
        createTime: new Date().toISOString().split("T")[0],
      };
      setPosts([newPost, ...posts]); // Add the new post to the list
      // Clear modal inputs
      setNewPostAuthor("");
      setNewPostTitle("");
      setNewPostContent("");
      setModalOpen(false);
    }
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  // Render post list or post detail
  return (
    <Container size="md" padding="lg">
      {/* Modal for creating a new post */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="새 게시물 만들기"
        centered
      >
        <TextInput
          label="작성자 이름"
          placeholder="이름"
          value={newPostAuthor}
          onChange={(event) => {
            setNewPostAuthor(event.target.value);
            setCurrentUser(event.target.value);
          }}
          required
          mb="sm"
        />
        <TextInput
          label="글 제목"
          placeholder="제목"
          value={newPostTitle}
          onChange={(event) => setNewPostTitle(event.target.value)}
          required
          mb="sm"
        />
        <Textarea
          label="글 내용"
          placeholder="내용"
          value={newPostContent}
          onChange={(event) => setNewPostContent(event.target.value)}
          minRows={4}
          required
        />
        <Button
          fullWidth
          mt="md"
          onClick={handleNewPostSubmit}
          disabled={
            !newPostTitle.trim() ||
            !newPostContent.trim() ||
            !newPostAuthor.trim()
          }
        >
          제출
        </Button>
      </Modal>

      {selectedPost ? (
        // Render PostDetail component if a post is selected
        <PostDetail props={selectedPost} />
      ) : posts.length === 0 ? (
        // Display message if no posts
        <Center>
          <Button
            className="postline-button"
            fz="h4"
            size="sm"
            onClick={() => setModalOpen(true)}
          >
            글 작성
          </Button>
          <Text size="xl" color="dimmed" ml={5}>
            게시물 없음
          </Text>
        </Center>
      ) : (
        // Render the list of posts
        <>
          <Button
            fz="h4"
            size="sm"
            className="postline-button"
            onClick={() => setModalOpen(true)}
            fullWidth={false}
          >
            글 작성
          </Button>
          <Stack spacing="md">
            {posts.map((post) => (
              <Card key={post.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Group position="apart" className="postline-card-group">
                  <div className="postline-group-div">
                    <Title
                      order={4}
                      className="postline-title"
                      onClick={() => handleTitleClick(post)}
                    >
                      {post.title}
                    </Title>

                    <Text size="sm" color="dimmed" className="postline-info-author-time-text">
                      <span className="postline-date">
                        작성날짜: <strong>{post.createTime}</strong>
                      </span>{" "}
                      <span>
                        작성자: <strong>{post.author}</strong>
                      </span>
                    </Text>
                  </div>
                  <Group>
                    {post.author === currentUser && (
                      <img
                        src="./src/images/red-icon.png"
                        alt="Icon"
                        style={{
                          width: "50px",
                          height: "50px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDeletePost(post.id)}
                      />
                    )}
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        
        </>
      )}
    </Container>
  );
};

export default PostLine;
