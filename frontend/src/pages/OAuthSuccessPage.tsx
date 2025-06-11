import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      window.location.href = `${window.location.origin}/dashboard`;
    } else {
      console.warn("토큰 또는 userId 없음. 로그인 페이지로 이동");
      window.location.href = `${window.location.origin}/login`;
    }
  }, [token, userId]);

  return <p>Logging you in with Google...</p>;
}
