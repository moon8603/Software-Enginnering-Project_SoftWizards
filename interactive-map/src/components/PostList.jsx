import { useState } from "react";
import ReplyForm from "./ReplyForm";
import useStore from "../store/store"; // Import Zustand store
import { Button, Card, Container, Group, Text, Title } from "@mantine/core";

const PostList = ({ posts, role, onUpdate, onDelete, onReply }) => {
  const { currentUser } = useStore(); // Get currentUser from Zustand
  const [replyingPostId, setReplyingPostId] = useState(null);

  return (
    <Container>
      {posts.map((post) => (
        <Card key={post.id} shadow="md" padding="lg" mb="md" bg="gray.1">
          <Title order={3} style={{ overflowWrap: "break-word" }}>
            {post.title}
          </Title>
          <Text
            size="sm"
            color="dimmed"
            mb="xs"
            fw="bold"
            style={{ overflowWrap: "break-word" }}
          >
            작성자: {post.author}
          </Text>
          <Text
            mb="md"
            lineClamp={4}
            style={{
              overflowWrap: "break-word",
              borderRadius: "4px",
              padding: "12px",
            }}
            bg="white"
          >
            {post.content}
          </Text>

          <Group position="apart" mb="sm">
            {/* User can edit/delete their own posts */}
            {post.author === currentUser && (
              <Group>
                <Button onClick={() => onUpdate(post)} variant="light">
                  수정
                </Button>
                <Button
                  onClick={() => onDelete(post.id)}
                  color="red"
                  variant="light"
                >
                  삭제
                </Button>
              </Group>
            )}
          </Group>

          {/* Admin can delete and reply to posts */}
          {role === "admin" && (
            <Group>
              <Button
                onClick={() => onDelete(post.id)}
                color="red"
                variant="light"
              >
                삭제 (Admin)
              </Button>
              <Button
                onClick={() => setReplyingPostId(post.id)}
                variant="light"
              >
                {replyingPostId === post.id ? "댓글 취소" : "댓글 추가"}
              </Button>
            </Group>
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
          <Title order={4} mt="xs">
            댓글
          </Title>
          <ul>
            {post.replies.map((reply) => (
              <Card key={reply.id} shadow="xs" padding="sm" mt="sm">
                <Text style={{ overflowWrap: "break-word" }}>
                  {reply.content}
                </Text>
                <Text size="xs" color="dimmed">
                  작성자: {reply.author}
                </Text>
              </Card>
            ))}
          </ul>
        </Card>
      ))}
    </Container>
  );
};

export default PostList;
