//게시글 작성 폼

// import { useState } from "react";
// import useStore from "../store/store";
// import { TextInput, Textarea, Button, Title, Stack } from "@mantine/core";

// const PostForm = ({ post, onSubmit, onClose }) => {
//   const { setCurrentUser } = useStore();

//   const [title, setTitle] = useState(post?.title || "");
//   const [content, setContent] = useState(post?.content || "");
//   const [author, setAuthor] = useState(post?.author || "");

//   const handleSubmit = () => {
//     if (title.length === 0 || content.length === 0 || author.length === 0) {
//       return;
//     }
//     onSubmit({ id: post?.id, title, content, author });
//     onClose();
//   };

//   return (
//     <Stack spacing="md" shadow="md" m="md" style={{ padding: "12px" }}>
//       <Title order={3}>{post ? "글 수정" : "글 작성"}</Title>

//       <TextInput
//         placeholder="작성자 이름"
//         value={author}
//         onChange={(e) => {
//           setAuthor(e.target.value);
//           setCurrentUser(e.target.value);
//         }}
//         label="작성자"
//         required
//       />
//       <TextInput
//         placeholder="제목"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         label="제목"
//         required
//       />
//       <Textarea
//         placeholder="내용"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         label="내용"
//         required
//       />

//       <Stack spacing="xs" mb="4vh">
//         <Button onClick={handleSubmit} color="blue">
//           {post ? "수정" : "작성"}
//         </Button>
//         <Button onClick={onClose} variant="outline" color="red">
//           취소
//         </Button>
//       </Stack>
//     </Stack>
//   );
// };

// export default PostForm;
