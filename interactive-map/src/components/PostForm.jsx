import React, { useState } from 'react'

const PostForm = ({ post, onSubmit, onClose }) => {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [author, setAuthor] = useState(post?.author || "");

  const handleSubmit = () => {
    onSubmit({ id: post?.id, title, content, author });
    onClose();
  }

  return (
    <div>
      <h2>{post ? "글 수정" : "글 작성"}</h2>
      <input
        type='text'
        placeholder='작성자 이름'
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type='text'
        placeholder='제목'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder='내용'
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={handleSubmit}>{post ? "수정" : "작성"}</button>
      <button onClick={onClose}>취소</button>
    </div>
  )
}

export default PostForm
