import { useState } from "react";
import { PostsService } from "../api/generated/services/PostsService";
import { ApiError } from "../api/generated/core/ApiError";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import Input from "./ui/Input";

export default function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await PostsService.postPosts({ title, content });
      navigate("/posts");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message || "Failed to create post.");
      } else {
        setError("Unknown error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Create New Post</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Title
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter post title"
            style={{ width: "100%", marginTop: "4px" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write your content here"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              minHeight: "120px",
              border: "1.2px solid #d5d7db",
              borderRadius: 8,
              background: "#f7f8fa",
              fontSize: "1rem",
              fontFamily: "inherit",
            }}
          />
        </label>
      </div>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}
      <Button type="submit" variant="primary">
        Create
      </Button>
    </form>
  );
}
