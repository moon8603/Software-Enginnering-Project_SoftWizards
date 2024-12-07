import {
  Card,
  Text,
  Group,
  Title,
  Stack,
  Paper,
  Button,
  Textarea,
  ActionIcon,
  Container,
} from "@mantine/core";
import { MdDeleteForever } from "react-icons/md";
import { useState } from "react";
import useStore from "../store/forumStore";

const PostDetail = ({ props }) => {
  const [isCommenting, setIsCommenting] = useState(false); // State to show/hide comment input area
  const [commentText, setCommentText] = useState(""); // State to hold the comment text
  const [replies, setReplies] = useState(props.replies || []); // State for replies/comments

  // Zustand store
  const isAdmin = useStore((state) => state.isAdmin);
  const setAdmin = useStore((state) => state.setAdmin);

  // Toggle admin mode for testing
  const toggleAdminMode = () => {
    setAdmin(!isAdmin);
  };

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      const newReply = {
        id: replies.length + 1,
        content: commentText,
        author: "Admin",
        createTime: new Date().toISOString().split("T")[0],
      };

      setReplies([newReply, ...replies]);
      setCommentText(""); // Clear the text area
      setIsCommenting(false); // Hide the comment input area
    }
  };

  // Handle comment deletion
  const handleDeleteComment = (id) => {
    setReplies(replies.filter((reply) => reply.id !== id));
  };

  return (
    <Container size="md" mb={60}>
      <Stack spacing="md">
        <Group spacing="sm">
          <Button onClick={toggleAdminMode} fz="md">
            {isAdmin ? "관리자 모드 OFF" : "관리자 모드 ON"}
          </Button>
          {isAdmin && (
            <Button onClick={() => setIsCommenting(true)} fz="md">
              댓글 작성
            </Button>
          )}
        </Group>

        {/* Post details */}
        <Card shadow="md" padding="lg" radius="md" withBorder>
          <Group position="apart">
            <Text
              size="md"
              color="dimmed"
              className="postdetail-container-stack-card-group-text"
            >
              <span>
                작성날짜: <strong>{props.createTime}</strong>
              </span>{" "}
              <span>
                작성자: <strong>{props.author}</strong>
              </span>
            </Text>
          </Group>
          <Title order={3} mt="md" className="postdetail-title">
            {props.title}
          </Title>
          <Text mt="xs" fz="lg" className="postdetail-content" c="gray.5">
            {props.content}
          </Text>
        </Card>

        {/* Admin comment creation area */}
        {isAdmin && isCommenting && (
          <Stack spacing="sm" mt="md">
            <Textarea
              placeholder="댓글을 입력하세요..."
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              minRows={3}
              required
            />
            <Group position="right">
              <Button onClick={handleCommentSubmit} variant="light">
                댓글 제출
              </Button>
              <Button
                color="red"
                onClick={() => {setIsCommenting(false); setCommentText("")}}
                variant="light"
              >
                취소
              </Button>
            </Group>
          </Stack>
        )}

        {/* Comments Section */}
        <div>
          <Text mt="xs" fz="h3" fw="bold">
            댓글
          </Text>
          {!isAdmin && (
            <Text size="sm" color="dimmed" mt="md">
              관리자만 댓글을 작성할 수 있습니다.
            </Text>
          )}
        </div>

        {/* Render Replies */}
        {replies && replies.length > 0 ? (
          replies.map((reply) => (
            <Paper
              key={reply.id}
              shadow="xs"
              radius="md"
              withBorder
              style={{ marginTop: "10px", padding: "20px" }}
            >
              <div>
                <Stack spacing="xs">
                  <Text
                    fw={700}
                    fz={20}
                    className="postdetail-paper-group-text"
                  >
                    {reply.content}
                  </Text>

                  <div className="postdetail-paper-div-stack-div">
                    <Text
                      size="md"
                      color="dimmed"
                      className="postdetail-container-stack-card-group-text"
                    >
                      <span>
                        작성날짜: <strong>{reply.createTime}</strong>
                      </span>{" "}
                      <span>
                        작성자: <strong>{reply.author}</strong>
                      </span>
                    </Text>

                    {isAdmin && (
                      <ActionIcon
                        onClick={() => handleDeleteComment(reply.id)}
                        color="red"
                        size="lg"
                        variant="transparent"
                      >
                        <MdDeleteForever size={28} />
                      </ActionIcon>
                    )}
                  </div>
                </Stack>
              </div>
            </Paper>
          ))
        ) : (
          <Text
            size="sm"
            color="dimmed"
            className="postdetail-container-stack-text"
          >
            댓글 없음.
          </Text>
        )}
      </Stack>
    </Container>
  );
};

export default PostDetail;