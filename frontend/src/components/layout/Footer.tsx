import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>© {new Date().getFullYear()} Pine Needles. All rights reserved.</div>
      <div className={styles.links}>
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </footer>
  );
}
