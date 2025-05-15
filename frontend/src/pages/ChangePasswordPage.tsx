import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/ChangePasswordForm.module.css";
import { UsersService } from "../api/generated/services/UsersService";
import type { UpdatePasswordDto } from "../api/generated/models/UpdatePasswordDto";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dto: UpdatePasswordDto = {
      currentPassword,
      newPassword,
    };

    try {
      await UsersService.patchUsersMePassword(dto);
      setMessage("Your password has been successfully changed.");
      setCurrentPassword("");
      setNewPassword("");

      // Navigate to dashboard after a short delay
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "body" in err) {
        const apiErr = err as { body?: { message?: string } };
        setMessage(apiErr.body?.message || "Failed to change password.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.heading}>
          <h2>Change Password</h2>
        </div>

        {message && <p className={styles.message}>{message}</p>}

        <div className={styles.inputGroup}>
          <label className={styles.label}>Current Password</label>
          <input
            type="password"
            className={styles.input}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

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
          Update Password
        </button>
      </form>
    </div>
  );
}
