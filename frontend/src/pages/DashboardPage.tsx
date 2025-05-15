import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardService } from "../api/generated/services/DashboardService";
import { AuthService } from "../api/generated/services/AuthService";
import type { User } from "../api/generated/models/User";

// 상수 정의
const ACCESS_TOKEN_KEY = "token";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      // 1. 서버에 로그아웃 요청 (refreshToken DB 제거 + 쿠키 삭제)
      await AuthService.postAuthLogout(); // POST /auth/logout

      // 2. 클라이언트 측 accessToken 삭제
      localStorage.removeItem(ACCESS_TOKEN_KEY);

      // 3. 로그인 페이지로 리디렉션
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // 비밀번호 변경 처리 함수
  const handleChangePassword = () => {
    navigate("/change-password");
  };

  // 대시보드 데이터 가져오는 useEffect
  useEffect(() => {
    console.log("DashboardPage rendered");

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);

        // 토큰이 없으면 로그인 페이지로 리디렉션
        if (!token) {
          navigate("/login");
          return;
        }

        console.log("Fetching dashboard data...");
        const res = await DashboardService.getDashboard();
        console.log("Dashboard response:", res);

        if (res.user) {
          setUser(res.user);
        } else {
          throw new Error("User not found in response");
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        navigate("/login"); // API 호출 실패 시 로그인 페이지로 리디렉션
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return <p>Loading dashboard...</p>;

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
