import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../components/ResetPasswordForm.module.css";
import { AuthService } from "../api/generated/services/AuthService";
import type { ResetPasswordDto } from "../api/generated/models/ResetPasswordDto";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid or expired reset link.");
      return;
    }

    try {
      const dto: ResetPasswordDto = { token, newPassword };
      await AuthService.postAuthResetPassword(dto);
      setSubmitted(true);
      setError(null);

      setTimeout(() => navigate("/login"), 2000);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "body" in err) {
        const apiErr = err as { body?: { message?: string } };
        setError(apiErr.body?.message || "Failed to reset password.");
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
          <p>Please enter your new password.</p>
        </div>

        {submitted ? (
          <p className={styles.message}>
            Password has been reset. Redirecting to login...
          </p>
        ) : (
          <>
            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>New Password</label>
              <input
                type="password"
                className={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.button}>
              Reset Password
            </button>
          </>
        )}
      </form>
    </div>
  );
}
