import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PostsService } from "../api/generated/services/PostsService";
import type { UpdatePostDto } from "../api/generated/models/UpdatePostDto";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function PostEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid post ID.");
      setLoading(false);
      return;
    }
    PostsService.getPosts1(id)
      .then((post) => {
        setTitle(post.title);
        setContent(post.content);
      })
      .catch(() => setError("Failed to load post."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updateDto: UpdatePostDto = { title, content };
      await PostsService.patchPosts(id!, updateDto);
      navigate(`/posts/${id}`);
    } catch {
      setError("Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Edit Post</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={3}
          placeholder="Title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={8}
          placeholder="Content"
          style={{
            width: "100%",
            padding: "8px",
            border: "1.2px solid #d5d7db",
            borderRadius: 8,
            background: "#f7f8fa",
            fontSize: "1rem",
            fontFamily: "inherit",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/posts/${id}`)}
          >
            Back to Detail
          </Button>
          <Button
            type="submit"
            variant="primary"
            style={{ alignSelf: "flex-end" }}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
