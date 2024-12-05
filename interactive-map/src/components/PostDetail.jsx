import {
  Card,
  Text,
  Group,
  Title,
  Stack,
  Paper,
  Button,
  Switch,
  Textarea
} from "@mantine/core";
import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";

const PostDetail = ({ props }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false); // State to show/hide comment input area
  const [commentText, setCommentText] = useState(""); // State to hold the comment text
  const [replies, setReplies] = useState(props.replies || []); // State for replies/comments


  const handleToggleAdmin = () => {
    setIsAdmin((prev) => !prev);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      const newReply = {
        id: replies.length + 1, // Simple ID assignment for demo purposes
        content: commentText,
        author: "Admin", // Since it's admin making the comment
        createTime: new Date().toISOString().split("T")[0], // Add creation time
      };

      setReplies([newReply, ...replies]); // Add the new comment to the replies list
      setCommentText(""); // Clear the text area
      setIsCommenting(false); // Hide the comment input area
    }
  };

  const handleDeleteComment = (id) => {
    setReplies(replies.filter((reply) => reply.id !== id));
  };

  return (
    <Stack
      spacing="md"
      style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}
    >
      {/* Post details */}
      <Card shadow="md" padding="lg" radius="md" withBorder>
        <Group position="apart">
          <Text size="sm" color="dimmed">
            Create at <strong>{props.createTime}</strong> by{" "}
            <strong>{props.author}</strong>
          </Text>
        </Group>
        <Title order={2} mt="md" className="postdetail-title">
          {props.title}
        </Title>
        <Text mt="xs" fz="lg" className="postdetail-content" c="gray.5">
          {props.content}
        </Text>
      </Card>

      <Switch
        label="Admin View"
        checked={isAdmin}
        onChange={handleToggleAdmin}
      />

      {/* useEffect으로 comment interface 구현 */}
      {isAdmin ? (
        <>
          <Button mt="md" color="blue" onClick={() => setIsCommenting(true)}>
            댓글 작성
          </Button>
          {isCommenting && (
            <Stack spacing="sm" mt="md">
              <Textarea
                placeholder="댓글을 입력하세요..."
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                minRows={3}
                required
              />
              <Group position="right">
                <Button onClick={handleCommentSubmit}>
                  댓글 제출
                </Button>
                <Button color="red" onClick={() => setIsCommenting(false)}>
                  취소
                </Button>
              </Group>
            </Stack>
            )}
        </>
      ) : (
        <Text size="sm" color="dimmed" mt="md">
          관리자만 댓글을 작성할 수 있습니다.
        </Text>
      )}

      {/* Comments */}
      <div className="comment-div">
        <Text mt="xs" fz="h3" fw="bold">
          댓글
        </Text>
      </div>

      {/* {props.replies && props.replies.length > 0 ? (
        props.replies.map((reply) => (
          <Paper
            key={reply.id}
            shadow="xs"
            radius="md"
            withBorder
            style={{ marginTop: "10px", padding: "20px" }}
          >
            <Text fw={600} fz="h4" className="postdetail-comment">
              {reply.content}
            </Text>

            <Text size="sm" color="dimmed" mt="xs">
              Create at <strong>{reply.createTime}</strong> by{" "}
              <strong>{reply.author}</strong>
            </Text>
          </Paper>
        ))
      ) : (
        <Text size="sm" color="dimmed" style={{ padding: "0 20px" }}>
          댓글 없음.
        </Text>
      )} */}

       {/* Render Replies */}
       {replies && replies.length > 0 ? (
          replies.map((reply) => (
            <Paper key={reply.id} shadow="xs" radius="md" withBorder style={{ marginTop: "10px", padding: "20px" }}>
              <>
                <Text fw={600} size="lg" className="postdetail-comment">
                  {reply.content}
                </Text>

                <Text size="sm" color="dimmed" mt="xs">
                  Created at <strong>{reply.createTime}</strong> by <strong>{reply.author}</strong>
                </Text>
              </>
              <MdDeleteForever onClick={() => handleDeleteComment(reply.id)} size="1.5em" color= "#228be6" cursor="pointer"/>

            </Paper>
          ))
        ) : (
          <Text size="sm" color="dimmed" style={{ padding: "0 20px", marginTop: "10px" }}>
            댓글 없음.
          </Text>
        )}
    </Stack>
  );
};

export default PostDetail;
