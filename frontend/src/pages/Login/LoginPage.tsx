import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  type Location,
} from "react-router-dom";
import { loginCredentialsSchema } from "../../schemas/auth.schema";
import { APP_ROUTES } from "../../configs/routes.config";
import {
  selectAuthError,
  selectAuthStatus,
  selectIsLoggedIn,
  selectLogin,
  selectResetAuthError,
  useAuthStore,
} from "../../stores/authStore";
import "./LoginPage.css";

interface LoginLocationState {
  from?: Location;
  message?: string;
}

type LoginFieldName = "username" | "password";
type LoginFieldErrors = Partial<Record<LoginFieldName, string>>;
type LoginTouchedFields = Partial<Record<LoginFieldName, true>>;

const LOGIN_FIELDS: LoginFieldName[] = ["username", "password"];

export default function LoginPage() {
  const login = useAuthStore(selectLogin);
  const resetAuthError = useAuthStore(selectResetAuthError);
  const status = useAuthStore(selectAuthStatus);
  const error = useAuthStore(selectAuthError);
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = isLoginLocationState(location.state)
    ? location.state
    : {};
  const searchParams = new URLSearchParams(location.search);
  const fromLocation = locationState.from;
  const fromQuery = searchParams.get("from");
  const from =
    fromQuery ||
    (fromLocation
      ? `${fromLocation.pathname}${fromLocation.search || ""}${fromLocation.hash || ""}`
      : APP_ROUTES.HOME);
  const loginMessage = locationState.message;
  const queryMessage =
    searchParams.get("message") === "session-expired"
      ? "Your session expired. Please sign in again."
      : null;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<LoginTouchedFields>({});

  useEffect(() => {
    if (isLoggedIn && !loginMessage && !queryMessage) {
      navigate(from, { replace: true });
    }
  }, [from, isLoggedIn, loginMessage, navigate, queryMessage]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetAuthError();

    const result = loginCredentialsSchema.safeParse({
      password,
      username,
    });

    if (!result.success) {
      setTouchedFields({
        password: true,
        username: true,
      });
      setFieldErrors(getLoginFieldErrors(result.error.issues));
      return;
    }

    try {
      await login(result.data);
      navigate(from, { replace: true });
    } catch {
      // The auth store owns login errors so DevTools can trace the state change.
    }
  };

  const setLoginFieldError = (
    field: LoginFieldName,
    message: string | null,
  ) => {
    setFieldErrors((current) => {
      const next = { ...current };

      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }

      return next;
    });
  };

  const getLoginValues = (
    overrides: Partial<Record<LoginFieldName, string>> = {},
  ) => ({
    password: overrides.password ?? password,
    username: overrides.username ?? username,
  });

  const validateLoginField = (
    field: LoginFieldName,
    values = getLoginValues(),
  ): string | null => {
    const result = loginCredentialsSchema.safeParse(values);
    if (result.success) {
      return null;
    }

    return getFieldMessage(result.error.issues, field);
  };

  const handleLoginFieldBlur = (field: LoginFieldName) => {
    setTouchedFields((current) => ({
      ...current,
      [field]: true,
    }));
    setLoginFieldError(field, validateLoginField(field));
  };

  const handleUsernameInput = (value: string) => {
    setUsername(value);

    if (touchedFields.username) {
      setLoginFieldError(
        "username",
        validateLoginField("username", getLoginValues({ username: value })),
      );
    }
  };

  const handlePasswordInput = (value: string) => {
    setPassword(value);

    if (touchedFields.password) {
      setLoginFieldError(
        "password",
        validateLoginField("password", getLoginValues({ password: value })),
      );
    }
  };

  const isFormValid = loginCredentialsSchema.safeParse({
    password,
    username,
  }).success;

  return (
    <section className="login-page">
      <h2>Login</h2>

      {(loginMessage || queryMessage) && (
        <p className="login-info" role="status">
          {loginMessage || queryMessage}
        </p>
      )}

      {status === "error" && error && (
        <p className="login-error" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleLogin} noValidate>
        <div className="login-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => handleUsernameInput(e.target.value)}
            onBlur={() => handleLoginFieldBlur("username")}
            disabled={status === "loading"}
            autoComplete="username"
            placeholder="your_username"
            aria-invalid={Boolean(fieldErrors.username)}
            aria-describedby={
              fieldErrors.username ? "login-username-error" : undefined
            }
            required
          />
          {fieldErrors.username && (
            <p id="login-username-error" className="login-field-error">
              {fieldErrors.username}
            </p>
          )}
        </div>
        <div className="login-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => handlePasswordInput(e.target.value)}
            onBlur={() => handleLoginFieldBlur("password")}
            disabled={status === "loading"}
            autoComplete="current-password"
            placeholder="your password"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password ? "login-password-error" : undefined
            }
            required
          />
          {fieldErrors.password && (
            <p id="login-password-error" className="login-field-error">
              {fieldErrors.password}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="login-btn"
          disabled={status === "loading" || !isFormValid}
        >
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="login-switch">
        Don&apos;t have an account? <Link to={APP_ROUTES.REGISTER}>Sign up</Link>
      </p>
    </section>
  );
}

function isLoginLocationState(value: unknown): value is LoginLocationState {
  return typeof value === "object" && value !== null;
}

function getLoginFieldErrors(
  issues: readonly { path: readonly unknown[]; message: string }[],
): LoginFieldErrors {
  const errors: LoginFieldErrors = {};

  for (const field of LOGIN_FIELDS) {
    const message = getFieldMessage(issues, field);

    if (message) {
      errors[field] = message;
    }
  }

  return errors;
}

function getFieldMessage(
  issues: readonly { path: readonly unknown[]; message: string }[],
  field: LoginFieldName,
): string | null {
  return issues.find((issue) => issue.path[0] === field)?.message ?? null;
}
