import React, { useState } from "react";
import ReplyForm from "./ReplyForm";
import useStore from "../store/store"; // Import Zustand store

const PostList = ({ posts, role, onUpdate, onDelete, onReply }) => {
  const { currentUser } = useStore(); // Get currentUser from Zustand
  const [replyingPostId, setReplyingPostId] = useState(null);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>작성자: {post.author}</p>

          {/* User can edit/delete their own posts */}
          {post.author === currentUser && (
            <>
              <button onClick={() => onUpdate(post)}>수정</button>
              <button onClick={() => onDelete(post.id)}>삭제</button>
            </>
          )}

          {/* Admin can delete and reply to posts */}
          {role === "admin" && (
            <>
              <button onClick={() => onDelete(post.id)}>삭제 (Admin)</button>
              <button onClick={() => setReplyingPostId(post.id)}>
                {replyingPostId === post.id ? "댓글 취소" : "댓글 추가"}
              </button>
            </>
          )}

          {/* ReplyForm is conditionally rendered when admin is replying */}
          {role === "admin" && replyingPostId === post.id && (
            <ReplyForm
              onSubmit={(replyContent) => {
                onReply(post.id, replyContent);
                setReplyingPostId(null);
              }}
            />
          )}

          {/* Display replies */}
          <h3>댓글</h3>
          <ul>
            {post.replies.map((reply) => (
              <li key={reply.id}>
                <p>{reply.content}</p>
                <p>작성자: {reply.author}</p>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
