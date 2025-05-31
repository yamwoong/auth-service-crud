// src/components/ErrorMessage.tsx
import styles from "./ErrorMessage.module.css";

export default function ErrorMessage({ message }: { message: string }) {
  return <div className={styles.error}>{message}</div>;
}
