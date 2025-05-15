import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginPage";
import SignUpForm from "./pages/RegisterPage";
import ForgotPasswordForm from "./pages/ForgotPasswordPage";
import Dashboard from "./pages/DashboardPage";
import ResetPasswordForm from "./pages/ResetPasswordPage";
import ChangePasswordForm from "./pages/ChangePasswordPage";
import OAuthSuccessPage from "./pages/OAuthSuccessPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<SignUpForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/change-password" element={<ChangePasswordForm />} />
        <Route path="/oauth-success" element={<OAuthSuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
