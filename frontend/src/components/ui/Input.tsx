import styles from "./Input.module.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  return <input className={styles.input} {...props} />;
}
