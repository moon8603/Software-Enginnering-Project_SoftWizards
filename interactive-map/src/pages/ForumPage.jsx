import React, { useEffect, useState } from "react";
import PostList from "../components/PostList";
import PostForm from "../components/PostForm";
import useStore from "../store/store"; // Import Zustand store

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [role, setRole] = useState("user"); // role to toggle between "user" and "admin"
  const { currentUser, setCurrentUser } = useStore();

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
    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
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
                { id: post.replies.length + 1, content: replyContent, author: "Admin" },
              ],
            }
          : post
      )
    );
  };

  const handleStartCreating = () => {
    const userName = prompt("Enter your name to create a post:");
    if (userName) {
      setCurrentUser(userName);
      setIsCreating(true);
    }
  };

  return (
    <div>
      <h1>게시판</h1>
      <button onClick={() => setIsCreating(true)}>글 작성</button>
      <button onClick={() => setRole(role === "user" ? "admin" : "user")}>
        {role === "admin" ? "관리자 모드 OFF" : "관리자 모드 ON"}
      </button>

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
    </div>
  );
};

export default ForumPage;