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
} from "@mantine/core";
import { MdDeleteForever } from "react-icons/md";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useStore from "../store/forumStore";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

var decodedToken;

const PostDetail = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  console.log("id입니다 ", id);
  const [posts, setPosts] = useState([]); // State for posts
  const [isCommenting, setIsCommenting] = useState(false); // State to show/hide comment input area
  const [commentText, setCommentText] = useState(""); // State to hold the comment text
  const [replies, setReplies] = useState([]);
  //const [replies, setReplies] = useState(props.replies || []); // State for replies/comments

  // Zustand store
  const isAdmin = useStore((state) => state.isAdmin);
  const setAdmin = useStore((state) => state.setAdmin);
  const adminEmail = useStore((state) => state.adminEmail);

  // Fetch comments from mock data
  useEffect(() => {
    if (!id) {
      console.error("Post ID is missing");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    
    
    if (token) {
      //const decodedToken = jwtDecode(token);
      decodedToken = jwtDecode(token);
      console.log(decodedToken);
      console.log("사용자 id는 ", decodedToken.id);
      if (decodedToken.email === adminEmail) {
        setAdmin(true);
      }
    }

    fetch(`http://localhost:3000/forumpage?id=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch post data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setReplies(data.data.commentsData || []);
        setPosts(data.data.postsData[0]);
      })
      .catch((error) => console.error(error));
  }, [id]);

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      const newComment = {
        //id: replies.length + 1,
        content: commentText,
        //author: "Admin",
        authorId: decodedToken.id,
        postId: id,
        //createdAt: new Date().toISOString().split("T")[0],
      };

      fetch("http://localhost:3000/forumpage/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to create comment");
          }
          return response.json();
        })
        .then(() => {
          //setReplies([newReply, ...replies]);
          setCommentText(""); // Clear the text area
          setIsCommenting(false); // Hide the comment input area

          window.location.reload(); // 새로고침 이 방법밖에 없는지?
        })
        .catch((error) => console.error("Error creating comment:", error));
    }
  };

  // Handle comment deletion
  const handleDeleteComment = (id) => {
    //setReplies(replies.filter((reply) => reply.id !== id));
    console.log("commentID: ", id);
    fetch(`http://localhost:3000/forumpage/comment/delete?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete post");
        }
        return response.json();
      })
      .then(() => {
        // 성공적으로 삭제 후 comments 상태 갱신
        setReplies(replies.filter((reply) => reply.id !== id));
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

  return (
    <div>
      <Stack>
        <Group>
          <Button
            className="postline-button"
            fz="h4"
            onClick={() => navigate("/forumpage")}
            fullWidth={false}
            variant="outline"
          >
            목록
          </Button>

          {isAdmin && (
            <Button
              className="postline-button-admin"
              onClick={() => setIsCommenting(true)}
              fz="md"
              variant="light"
            >
              댓글 작성
            </Button>
          )}
        </Group>
        {/* Post details */}
        <Card shadow="lg" padding="lg" radius="md" withBorder>
          <Group position="apart">
            <Text
              size="md"
              color="dimmed"
              className="postdetail-container-stack-card-group-text"
            >
              <span>
                작성날짜: <strong>{posts.createdAt}</strong>
              </span>{" "}
              <span>
                작성자: <strong>{posts.author}</strong>
              </span>
            </Text>
          </Group>
          <Title order={3} mt="md" className="postdetail-title">
            {posts.title}
          </Title>
          <Text mt="xs" fz="lg" className="postdetail-content" c="gray.5">
            {posts.content}
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
                onClick={() => {
                  setIsCommenting(false);
                  setCommentText("");
                }}
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
              shadow="lg"
              radius="md"
              withBorder
              className="postdetail-paper"
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
                        작성날짜: <strong>{reply.createdAt}</strong>
                      </span>{" "}
                      <span>
                        작성자: <strong>{reply.email}</strong>
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
    </div>
  );
};

export default PostDetail;
