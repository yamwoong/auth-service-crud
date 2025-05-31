import styles from "./PostCard.module.css";
import type { Post } from "../api/generated/models/Post";

export function PostCard({
  post,
  onClick,
}: {
  post: Post;
  onClick?: () => void;
}) {
  return (
    <div className={styles.card} onClick={onClick}>
      <h2 className={styles.title}>{post.title}</h2>
      <div className={styles.content}>{post.content?.slice(0, 80)}...</div>
    </div>
  );
}
