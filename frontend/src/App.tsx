import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import LoginForm from "./pages/LoginPage";
import SignUpForm from "./pages/RegisterPage";
import ForgotPasswordForm from "./pages/ForgotPasswordPage";
import Dashboard from "./pages/DashboardPage";
import ResetPasswordForm from "./pages/ResetPasswordPage";
import ChangePasswordForm from "./pages/ChangePasswordPage";
import OAuthSuccessPage from "./pages/OAuthSuccessPage";
import PostListPage from "./pages/PostListPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditPage from "./pages/PostEditPage";

// import PostListPage from "./pages/PostListPage";
// import PostDetailPage from "./pages/PostDetailPage";
// import PostFormPage from "./pages/PostFormPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ minHeight: "80vh", padding: "40px 0 0 0" }}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<SignUpForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/change-password" element={<ChangePasswordForm />} />
          <Route path="/oauth-success" element={<OAuthSuccessPage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/new" element={<CreatePostPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/posts/:id/edit" element={<PostEditPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
