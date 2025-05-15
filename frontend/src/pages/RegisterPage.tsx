import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../components/LoginForm.module.css";
import { UsersService } from "../api/generated/services/UsersService";
import type { CreateUserDto } from "../api/generated/models/CreateUserDto";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (form.username.length > 30) {
      newErrors.username = "Username must be at most 30 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email must be a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const dto: CreateUserDto = {
        username: form.username,
        name: form.name,
        email: form.email,
        password: form.password,
      };

      console.log("DTO being sent:", dto);

      await UsersService.postUsers(dto);
      navigate("/login");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "body" in err) {
        const apiErr = err as { body?: { message?: string } };
        setError(apiErr.body?.message || "Registration failed.");
      } else {
        setError("Unexpected error occurred.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.heading}>
          <h2>Create an Account</h2>
          <p>Please fill in the information below to register.</p>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className={styles.inputGroup}>
          <label className={styles.label}>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Your username"
            className={styles.input}
            value={form.username}
            onChange={handleChange}
            required
          />

          {errors.username && <p className={styles.error}>{errors.username}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            className={styles.input}
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            className={styles.input}
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            className={styles.input}
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="********"
            className={styles.input}
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.button}>
          Sign Up
        </button>

        <div className={styles.divider}></div>

        <button type="button" className={styles.googleButton}>
          <img
            className={styles.googleIcon}
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
          Continue with Google
        </button>

        <div className={styles.footer}>
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </form>
    </div>
  );
}
