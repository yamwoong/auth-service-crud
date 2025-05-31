import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../components/LoginForm.module.css";
import { UsersService } from "../api/generated/services/UsersService";
import type { CreateUserDto } from "../api/generated/models/CreateUserDto";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

// Type for managing form state
interface FormState {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();

  // Form field state
  const [form, setForm] = useState<FormState>({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for field-specific error messages
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  // State for general server-side API error
  const [apiError, setApiError] = useState<string | null>(null);

  // Validate form fields before submitting
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    // Username validation
    if (!form.username.trim()) {
      newErrors.username = "Please enter a username.";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    } else if (form.username.length > 30) {
      newErrors.username = "Username must be at most 30 characters.";
    }

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Please enter your full name.";
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]{2,}$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Please enter a password.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update form state when user changes any input field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError(null);
  };

  // Handle form submission
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
      // Handle possible server-side validation errors
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

        {/* USERNAME FIELD */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Username</label>
          <Input
            type="text"
            name="username"
            placeholder="Your username"
            value={form.username}
            onChange={handleChange}
            required
          />
          {errors.username && <p className={styles.error}>{errors.username}</p>}
        </div>

        {/* FULL NAME FIELD */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Full Name</label>
          <Input
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>

        {/* EMAIL FIELD */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <Input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        {/* PASSWORD FIELD */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <Input
            type="password"
            name="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        {/* CONFIRM PASSWORD FIELD */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Confirm Password</label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="********"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit button using the common Button component */}
        <Button type="submit" variant="primary">
          Sign Up
        </Button>

        <div className={styles.divider}></div>

        {/* Google registration button (disabled for now) */}
        <Button type="button" variant="google" disabled>
          <img
            className={styles.googleIcon}
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
          Continue with Google
        </Button>

        <div className={styles.footer}>
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </form>
    </div>
  );
}
