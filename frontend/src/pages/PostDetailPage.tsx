import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PostsService } from "../api/generated/services/PostsService";
import type { Post } from "../api/generated/models/Post";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/ui/Button";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!id) {
      setError("Invalid post ID.");
      setLoading(false);
      return;
    }

    PostsService.getPosts1(id)
      .then(setPost)
      .catch(() => setError("Failed to load post."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return <ErrorMessage message="Post not found." />;

  const isAuthor =
    isLoggedIn &&
    userId &&
    post.authorId &&
    String(userId) === String(post.authorId);

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await PostsService.deletePosts(id);
      alert("Post deleted!");
      navigate("/posts");
    } catch {
      alert("Failed to delete post.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>{post.title}</h1>
      <p style={{ whiteSpace: "pre-line" }}>{post.content}</p>
      <div style={{ marginTop: "2rem" }}>
        <Button variant="secondary" onClick={() => navigate("/posts")}>
          Back to List
        </Button>
        {isAuthor && (
          <>
            <Button
              style={{ marginLeft: "1rem" }}
              variant="primary"
              onClick={() => navigate(`/posts/${post.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              style={{ marginLeft: "1rem" }}
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
