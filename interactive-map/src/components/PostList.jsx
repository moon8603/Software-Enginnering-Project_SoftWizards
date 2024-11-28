import React from 'react'

const PostList = ({ posts, onEdit, onDelete, isAdmin }) => {
  return (
    <ul>
      {posts.map((post) => (
        <li key = {post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>작성자: {post.author}</p>
          <button onClick={() => onEdit(post)}>수정</button>
          {isAdmin && <button onClick={() => onDelete(post.id)}>삭제</button>}
        </li>
      ))}
    </ul>
  );
};

export default PostList
