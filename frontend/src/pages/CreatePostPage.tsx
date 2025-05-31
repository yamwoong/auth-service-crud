import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreatePostForm from "../components/CreatePostForm";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      alert("You need to log in to create a post.");
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return <CreatePostForm />;
}
