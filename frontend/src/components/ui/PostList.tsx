import styles from "./PostList.module.css";

type Post = {
  id: string;
  title: string;
  content?: string;
  author?: string;
  date?: string;
  commentCount?: number;
  tags?: string[];
};

type PostListProps = {
  posts: Post[];
  onPostClick?: (id: string) => void;
};

export default function PostList({ posts, onPostClick }: PostListProps) {
  return (
    <div className={styles.postList}>
      {posts.length === 0 && <div className={styles.empty}>No posts yet.</div>}
      {posts.map((post) => (
        <div
          className={styles.postRow}
          key={post.id}
          onClick={() => onPostClick && onPostClick(post.id)}
          tabIndex={0}
        >
          <div className={styles.postTitle}>{post.title}</div>
          <div className={styles.postPreview}>{post.content}</div>
          <div className={styles.postMeta}>
            <span>{post.author}</span>
            <span>{post.date}</span>
            <span>💬 {post.commentCount ?? 0}</span>
            {post.tags &&
              post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
