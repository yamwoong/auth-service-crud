import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Pine Needles</Link>
      </div>
      <div className={styles.menu}>
        <Link to="/posts">Posts</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Sign In</Link>
      </div>
    </nav>
  );
}
