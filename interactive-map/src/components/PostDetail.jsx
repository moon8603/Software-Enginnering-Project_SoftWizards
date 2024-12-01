import { Card, Text, Group, Title, Stack, Paper } from "@mantine/core";

const PostDetail = ({ props }) => {
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

      {/* Comments */}
      <Text mt="xs" fz="h3" fw="bold">
        댓글
      </Text>

      {props.replies && props.replies.length > 0 ? (
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
      )}
    </Stack>
  );
};

export default PostDetail;
