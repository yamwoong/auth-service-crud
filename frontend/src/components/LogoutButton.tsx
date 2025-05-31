// src/components/LogoutButton.tsx
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1) Send logout API request
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      // 2) Remove "token" from localStorage
      localStorage.removeItem("token");

      // 3) Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="btn-logout">
      Logout
    </button>
  );
};

export default LogoutButton;
