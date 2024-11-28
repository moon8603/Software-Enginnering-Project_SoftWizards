import React, { useEffect, useState } from "react";
import PostList from "../components/PostList";
import PostForm from "../components/PostForm";


const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // mock 데이터 가져오기 - demo용
  useEffect(() => {
    fetch("./src/mock/mockPosts.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch facilities data");
        }
        return response.json();
      })
      .then((data) => setPosts(data))
  }, []);

  const handleCreatePost = (post) => {
    setPosts([...post, { ...post, id: posts.length + 1 }]);
    setIsCreating(false);
  }

  const handleUpdatePost = (updatePost) => {
    setPosts(posts.map((post) => (post.id === updatePost.id ? updatePost : post)));
    setSelectedPost(null);
  }

  const handleDeletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div>
      <h1>게시판</h1>
      <button onClick={() => setIsCreating(true)}>글 작성</button>
      <button onClick={() => setIsAdmin(!isAdmin)}>
        {isAdmin ? "관리자 모드 OFF" : "관리자 모드 ON"}
      </button>
      <PostList
        posts={posts}
        onEdit={setSelectedPost}
        onDelete={handleDeletePost}
        isAdmin={isAdmin}
      />
      {isCreating && (
        <PostForm 
          onSubmit={handleCreatePost}
          onClose={() => setIsCreating(false)}
        />
      )}
      {selectedPost && (
        <PostForm 
          post={selectedPost}
          onSubmit={handleUpdatePost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default ForumPage;