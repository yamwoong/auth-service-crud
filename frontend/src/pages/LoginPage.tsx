import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../components/LoginForm.module.css";
import { api } from "../lib/api";

function isAxiosError(error: unknown): error is {
  isAxiosError: true;
  response?: {
    data?: {
      message?: string;
    };
  };
} {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as { isAxiosError?: boolean }).isAxiosError === true
  );
}

export default function LoginForm() {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const isEmail = input.includes("@");

    try {
      const response = await api.post<{ token: string }>("/auth/login", {
        ...(isEmail ? { email: input } : { username: input }),
        password,
      });

      const { token } = response.data;
      console.log("Token stored:", token);
      localStorage.setItem("token", token);
      console.log("Navigating to dashboard...");
      navigate("/dashboard");
    } catch (err) {
      if (isAxiosError(err)) {
        const message =
          err.response?.data?.message || "Login failed. Please try again.";
        setError(message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.heading}>
          <h2>Sign In</h2>
          <p>Please enter your email or username and password.</p>
        </div>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email or Username</label>
          <input
            type="text"
            className={styles.input}
            placeholder="email or username"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            className={styles.input}
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.button}>
          Sign In
        </button>

        <div className={styles.divider}></div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className={styles.googleButton}
        >
          <img
            className={styles.googleIcon}
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
          Continue with Google
        </button>

        <div className={styles.footer}>
          <p>
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
