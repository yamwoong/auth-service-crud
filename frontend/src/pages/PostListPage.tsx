import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/PostListPage.module.css";
import { PostsService } from "../api/generated/services/PostsService";
import type { Post } from "../api/generated/models/Post";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import PostList from "../components/ui/PostList";

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Login state detection
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    PostsService.getPosts()
      .then(setPosts)
      .catch(() => setError("Failed to load posts."))
      .finally(() => setLoading(false));
  }, []);

  const handleCreatePost = () => {
    if (!isLoggedIn) {
      alert("You need to log in to create a post.");
      navigate("/login");
      return;
    }
    navigate("/posts/new");
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>Post List</h1>
        <button className={styles.createBtn} onClick={handleCreatePost}>
          New Post
        </button>
      </div>
      <PostList
        posts={posts
          .filter((p) => !!p.id && !!p.title && !!p.content)
          .map((p) => ({
            ...p,
            id: p.id as string,
            title: p.title as string,
            content: p.content as string,
          }))}
        onPostClick={(id) => navigate(`/posts/${id}`)}
      />
    </div>
  );
}
