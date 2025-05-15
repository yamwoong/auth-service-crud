import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../components/ForgotPasswordForm.module.css";
import { AuthService } from "../api/generated/services/AuthService";
import type { ForgotPasswordDto } from "../api/generated/models/ForgotPasswordDto";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dto: ForgotPasswordDto = { username };
      await AuthService.postAuthForgotPassword(dto);
      setSubmitted(true);
      setError(null);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "body" in err) {
        const apiErr = err as { body?: { message?: string } };
        setError(apiErr.body?.message || "Failed to send reset email.");
      } else {
        setError("Unexpected error occurred.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.heading}>
          <h2>Reset Password</h2>
          <p>Enter your username to receive a reset link via email.</p>
        </div>

        {submitted ? (
          <p style={{ textAlign: "center", color: "green" }}>
            An email has been sent. Please check your inbox!
          </p>
        ) : (
          <>
            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.button}>
              Send Email
            </button>
          </>
        )}

        <div className={styles.footer}>
          <Link to="/login">← Back to Login</Link>
        </div>
      </form>
    </div>
  );
}
