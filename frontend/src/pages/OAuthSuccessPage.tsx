import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);

      window.location.href = `${window.location.origin}/dashboard`;
    } else {
      window.location.href = `${window.location.origin}/login`;
    }
  }, [token]);

  return <p>Logging you in with Google...</p>;
}
