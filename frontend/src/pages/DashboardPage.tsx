import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardService } from "../api/generated/services/DashboardService";
import { AuthService } from "../api/generated/services/AuthService";
import type { User } from "../api/generated/models/User";

const ACCESS_TOKEN_KEY = "token";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleLogout = async () => {
    try {
      await AuthService.postAuthLogout();
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem("userId");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  useEffect(() => {
    const params = new URLSearchParams(search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokenFromUrl);
      navigate("/dashboard", { replace: true });
      return;
    }

    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchUser = async () => {
      try {
        console.log("Fetching dashboard data...");
        const res = await DashboardService.getDashboard();
        if (res.user) {
          setUser(res.user);
        } else {
          throw new Error("User not found in response");
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        navigate("/login", { replace: true });
      }
    };

    fetchUser();
  }, [navigate, search]);

  if (!user) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      <p>Email: {user.email}</p>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleChangePassword}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Change Password
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
