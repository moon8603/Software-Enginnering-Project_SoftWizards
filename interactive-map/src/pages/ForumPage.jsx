import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import PostForm from "../components/PostForm";
import { Button, Container, Group, Title } from "@mantine/core";
import "../index.css";

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [role, setRole] = useState("user"); // toggle between "user" and "admin"

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

  const handleCreatePost = (newPost) => {
    setPosts([...posts, { ...newPost, id: posts.length + 1, replies: [] }]);
    setIsCreating(false);
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleAddReply = (postId, replyContent) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              replies: [
                ...post.replies,
                {
                  id: post.replies.length + 1,
                  content: replyContent,
                  author: "Admin",
                },
              ],
            }
          : post
      )
    );
  };

  return (
    <Container w="100%" h="100vh">
      <Title order={1} align="center" mb="lg" pt="xl">
        게시판
      </Title>
      <Group position="center" mb="sm">
        <Button onClick={() => setIsCreating(true)} variant="filled" fz="md">
          글 작성
        </Button>
        <Button
          onClick={() => setRole(role === "user" ? "admin" : "user")}
          variant="outline"
          fz="md"
        >
          {role === "admin" ? "관리자 모드 OFF" : "관리자 모드 ON"}
        </Button>
      </Group>

      <PostList
        posts={posts}
        role={role}
        onUpdate={handleUpdatePost}
        onDelete={handleDeletePost}
        onReply={handleAddReply}
      />

      {isCreating && (
        <PostForm
          onSubmit={handleCreatePost}
          onClose={() => setIsCreating(false)}
        />
      )}
    </Container>
  );
};

export default ForumPage;
