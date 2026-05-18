import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  selectAuthError,
  selectAuthStatus,
  selectLogin,
  selectResetAuthError,
  useAuthStore,
} from "../stores/authStore";
import "./LoginPage.css";

export default function LoginPage() {
  const login = useAuthStore(selectLogin);
  const resetAuthError = useAuthStore(selectResetAuthError);
  const status = useAuthStore(selectAuthStatus);
  const error = useAuthStore(selectAuthError);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/cart";

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123");

  const handleLogin = async (e) => {
    e.preventDefault();
    resetAuthError();

    try {
      await login({ username, password });
      navigate(from, { replace: true });
    } catch {
      // The auth store owns login errors so DevTools can trace the state change.
    }
  };

  return (
    <section className="login-page">
      <h2>Login</h2>
      <p className="login-hint">
        Demo: admin / 123. Token is sent via API interceptor.
      </p>

      {status === "error" && error && (
        <p className="login-error" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleLogin}>
        <div className="login-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={status === "loading"}
            autoComplete="username"
          />
        </div>
        <div className="login-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === "loading"}
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="login-btn"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </section>
  );
}
