import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../components/LoginForm.module.css";
import { UsersService } from "../api/generated/services/UsersService";
import type { CreateUserDto } from "../api/generated/models/CreateUserDto";

interface FormState {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Field-specific error messages
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  // General server error
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    // USERNAME validations
    if (!form.username.trim()) {
      newErrors.username = "Please enter a username.";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    } else if (form.username.length > 30) {
      newErrors.username = "Username must be at most 30 characters.";
    }

    // NAME validation
    if (!form.name.trim()) {
      newErrors.name = "Please enter your full name.";
    }

    // EMAIL validations
    if (!form.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]{2,}$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // PASSWORD validations
    if (!form.password) {
      newErrors.password = "Please enter a password.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // CONFIRM PASSWORD validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error and general API error on change
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) return;

    const dto: CreateUserDto = {
      username: form.username,
      name: form.name,
      email: form.email,
      password: form.password,
    };

    try {
      await UsersService.postUsers(dto);
      navigate("/login");
    } catch (err: unknown) {
      // Handle server-side validation errors if provided
      if (
        err &&
        typeof err === "object" &&
        err !== null &&
        "body" in err &&
        err.body !== undefined
      ) {
        const apiErr = err as {
          body?: { message?: string; details?: Record<string, unknown> };
        };
        const details = apiErr.body?.details;
        if (details && typeof details === "object") {
          const fieldErrors: Partial<Record<keyof FormState, string>> = {};
          Object.entries(details).forEach(([key, value]) => {
            if (
              (key === "username" ||
                key === "name" ||
                key === "email" ||
                key === "password" ||
                key === "confirmPassword") &&
              typeof value === "string"
            ) {
              fieldErrors[key as keyof FormState] = value;
            }
          });
          setErrors(fieldErrors);
        }
        // Always show general error too
        setApiError(apiErr.body?.message || "Registration failed.");
      } else {
        setApiError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.heading}>
          <h2>Create an Account</h2>
          <p>Please fill in the information below to register.</p>
        </div>

        {/* General API error */}
        {apiError && <p className={styles.error}>{apiError}</p>}

        {/* USERNAME */}
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

        {/* NAME */}
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
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>

        {/* EMAIL */}
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
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        {/* PASSWORD */}
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
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        {/* CONFIRM PASSWORD */}
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
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}
        </div>

        <button type="submit" className={styles.button}>
          Sign Up
        </button>

        <div className={styles.divider}></div>

        <button type="button" className={styles.googleButton} disabled>
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
