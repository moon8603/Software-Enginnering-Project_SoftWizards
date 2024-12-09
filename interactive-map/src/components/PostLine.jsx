import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import PostDetail from "./PostDetail";
import {
  Card,
  Text,
  Title,
  Container,
  Stack,
  Button,
  Modal,
  Textarea,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import useStore from "../store/forumStore";
import { MdDeleteForever } from "react-icons/md";

const PostLine = () => {
  const [posts, setPosts] = useState([]); // State for posts
  //const { currentUser, setCurrentUser } = useStore();
  // const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // States for user input in the modal
  const [newPostAuthor, setNewPostAuthor] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const isAdmin = useStore((state) => state.isAdmin);
  const setAdmin = useStore((state) => state.setAdmin);

  const navigate = useNavigate();

  // Fetch posts from mock data
  useEffect(() => {
    fetch("http://localhost:3000/forumpage")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts data");
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data.data.postsData || []);
      })
      .catch((error) => console.error(error));
  }, []);


  // Handle title click
  // const handleTitleClick = (post) => {
  //   setSelectedPost(post);
  // };

  // Handle "글 작성" button click
  const handleNewPostSubmit = () => {
    if (newPostTitle.trim() && newPostContent.trim() && newPostAuthor.trim()) {
      const newPost = {
        //id: posts.length + 1,
        title: newPostTitle,
        content: newPostContent,
        author: newPostAuthor,
        //createdAt: new Date().toISOString().split("T")[0],
      };

      fetch("http://localhost:3000/forumpage/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to create post");
          }
          return response.json();
        })
        .then(() => {
          setNewPostAuthor("");
          setNewPostTitle("");
          setNewPostContent("");
          setModalOpen(false); // Close the modal
          window.location.reload(); // 새로고침 이 방법밖에 없는지?
        })
        .catch((error) => console.error("Error creating post:", error));
    }
  };

  //아영님거
  // const handleDeletePost = (id) => {
  //   setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  // };

  //gpt거
  const handleDeletePost = (id) => {
    fetch(`http://localhost:3000/forumpage/delete?id=${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete post");
        return response.json();
      })
      .then(() => setPosts(posts.filter((post) => post.id !== id)))
      .catch((error) => console.error("Error deleting post:", error));
  };


  // Render post list or post detail
  return (
    <Container size="md" mb={60}>
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
            //setCurrentUser(event.target.value);
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
      <Button
        fz="h4"
        size="sm"
        className="postline-button"
        onClick={() => setModalOpen(true)}
        fullWidth={false}
      >
        글 작성
      </Button>
      <Button onClick={() => setAdmin(!isAdmin)} className="postline-button-admin">
        {isAdmin ? "관리자 모드 OFF" : "관리자 모드 ON"}
      </Button>


      <Stack spacing="md">
        {posts.map((post) => (
          //console.log(post.id);
          <Card key={post.id} shadow="sm" padding="lg" radius="md" withBorder>
            <div>
              <div className="postline-group-div">
                <Title
                  order={4}
                  className="postline-title"
                  // onClick={() => handleTitleClick(post)}
                  onClick={() => navigateToPostDetail(post.id)}
                >
                  {post.title}
                </Title>
                <div className="postline-container-stack-card-div">
                  <Text
                    size="md"
                    color="dimmed"
                    className="postline-info-author-time-text"
                  >
                    <span>
                      작성날짜: <strong>{post.createdAt}</strong>
                    </span>
                    <span>
                      작성자: <strong>{post.author}</strong>
                    </span>
                  </Text>

                  {isAdmin && (
                    <ActionIcon
                      onClick={() => handleDeletePost(post.id)}
                      color="red"
                      size="lg"
                      variant="transparent"
                      className="post-detail-paper-div-stack-div"
                    >
                      <MdDeleteForever size={28} />
                    </ActionIcon>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default PostLine;
