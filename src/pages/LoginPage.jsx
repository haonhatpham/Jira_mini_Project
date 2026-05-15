import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/cart";

  const handleLogin = (e) => {
    e.preventDefault();
    login();
    navigate(from, { replace: true });
  };

  return (
    <section className="login-page">
      <h2>Login</h2>
      <p className="login-hint">
        Cart is protected. Sign in to continue
        {from !== "/cart" ? ` to ${from}` : ""}.
      </p>
      <form onSubmit={handleLogin}>
        <button type="submit" className="login-btn">
          Sign in (demo)
        </button>
      </form>
    </section>
  );
}
