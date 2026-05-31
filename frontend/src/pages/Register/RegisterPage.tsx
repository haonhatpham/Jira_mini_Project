import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCredentialsSchema } from "../../schemas/auth.schema";
import { APP_ROUTES } from "../../configs/routes.config";
import {
  selectAuthError,
  selectAuthStatus,
  selectIsLoggedIn,
  selectRegister,
  selectResetAuthError,
  useAuthStore,
} from "../../stores/authStore";
import "./RegisterPage.css";

type PasswordStrengthLevel = "empty" | "weak" | "medium" | "strong";

type PasswordStrength = {
  level: PasswordStrengthLevel;
  label: string;
  percent: number;
};

type RegisterFieldName = "email" | "username" | "password" | "confirmPassword";
type RegisterFieldErrors = Partial<Record<RegisterFieldName, string>>;
type RegisterTouchedFields = Partial<Record<RegisterFieldName, true>>;

const REGISTER_FIELDS: RegisterFieldName[] = [
  "email",
  "username",
  "password",
  "confirmPassword",
];

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      level: "empty",
      label: "Password strength",
      percent: 0,
    };
  }

  const score = [
    password.length >= 6,
    password.length >= 10,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  if (score <= 2) {
    return {
      level: "weak",
      label: "Weak",
      percent: 33,
    };
  }

  if (score <= 4) {
    return {
      level: "medium",
      label: "Medium",
      percent: 66,
    };
  }

  return {
    level: "strong",
    label: "Strong",
    percent: 100,
  };
}

export default function RegisterPage() {
  const register = useAuthStore(selectRegister);
  const resetAuthError = useAuthStore(selectResetAuthError);
  const status = useAuthStore(selectAuthStatus);
  const error = useAuthStore(selectAuthError);
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<RegisterTouchedFields>({});

  useEffect(() => {
    if (isLoggedIn) {
      navigate(APP_ROUTES.HOME, { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetAuthError();

    const result = registerCredentialsSchema.safeParse({
      confirmPassword,
      email,
      password,
      username,
    });

    if (!result.success) {
      setTouchedFields({
        confirmPassword: true,
        email: true,
        password: true,
        username: true,
      });
      setFieldErrors(getRegisterFieldErrors(result.error.issues));
      return;
    }

    try {
      await register(result.data);
      navigate(APP_ROUTES.HOME, { replace: true });
    } catch {
      // The auth store owns API errors so DevTools can trace the state change.
    }
  };

  const setRegisterFieldError = (
    field: RegisterFieldName,
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

  const getRegisterValues = (
    overrides: Partial<Record<RegisterFieldName, string>> = {},
  ) => ({
    confirmPassword: overrides.confirmPassword ?? confirmPassword,
    email: overrides.email ?? email,
    password: overrides.password ?? password,
    username: overrides.username ?? username,
  });

  const validateRegisterField = (
    field: RegisterFieldName,
    values = getRegisterValues(),
  ): string | null => {
    const result = registerCredentialsSchema.safeParse(values);
    if (result.success) {
      return null;
    }

    return getFieldMessage(result.error.issues, field);
  };

  const handleRegisterFieldBlur = (field: RegisterFieldName) => {
    setTouchedFields((current) => ({
      ...current,
      [field]: true,
    }));
    setRegisterFieldError(field, validateRegisterField(field));
  };

  const validateTouchedRegisterField = (
    field: RegisterFieldName,
    values: ReturnType<typeof getRegisterValues>,
  ) => {
    if (touchedFields[field]) {
      setRegisterFieldError(field, validateRegisterField(field, values));
    }
  };

  const handleEmailInput = (value: string) => {
    setEmail(value);
    validateTouchedRegisterField("email", getRegisterValues({ email: value }));
  };

  const handleUsernameInput = (value: string) => {
    setUsername(value);
    validateTouchedRegisterField(
      "username",
      getRegisterValues({ username: value }),
    );
  };

  const handlePasswordInput = (value: string) => {
    setPassword(value);

    const nextValues = getRegisterValues({ password: value });
    validateTouchedRegisterField("password", nextValues);
    validateTouchedRegisterField("confirmPassword", nextValues);
  };

  const handleConfirmPasswordInput = (value: string) => {
    setConfirmPassword(value);
    validateTouchedRegisterField(
      "confirmPassword",
      getRegisterValues({ confirmPassword: value }),
    );
  };

  const isLoading = status === "loading";
  const passwordStrength = getPasswordStrength(password);
  const formValidation = registerCredentialsSchema.safeParse({
    confirmPassword,
    email,
    password,
    username,
  });
  const isFormValid = formValidation.success;

  return (
    <section className="register-page">
      <h2>Create an account</h2>

      {status === "error" && error && (
        <p className="register-error" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleRegister} noValidate>
        <div className="register-field">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => handleEmailInput(e.target.value)}
            onBlur={() => handleRegisterFieldBlur("email")}
            disabled={isLoading}
            autoComplete="email"
            autoFocus
            placeholder="Ex: name@example.com"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={
              fieldErrors.email ? "register-email-error" : undefined
            }
            required
          />
          {fieldErrors.email && (
            <p id="register-email-error" className="register-field-error">
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div className="register-field">
          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            value={username}
            onChange={(e) => handleUsernameInput(e.target.value)}
            onBlur={() => handleRegisterFieldBlur("username")}
            disabled={isLoading}
            autoComplete="username"
            placeholder="new_customer"
            aria-invalid={Boolean(fieldErrors.username)}
            aria-describedby={
              fieldErrors.username ? "register-username-error" : undefined
            }
            required
          />
          {fieldErrors.username && (
            <p id="register-username-error" className="register-field-error">
              {fieldErrors.username}
            </p>
          )}
        </div>
        <div className="register-field">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => handlePasswordInput(e.target.value)}
            onBlur={() => handleRegisterFieldBlur("password")}
            disabled={isLoading}
            autoComplete="new-password"
            placeholder="Create a password"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password ? "register-password-error" : undefined
            }
            required
          />
          {fieldErrors.password && (
            <p id="register-password-error" className="register-field-error">
              {fieldErrors.password}
            </p>
          )}
          <div className="password-strength">
            <div
              className="password-strength-meter"
              role="meter"
              aria-label="Password strength"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={passwordStrength.percent}
            >
              <span
                className={`password-strength-fill password-strength-fill--${passwordStrength.level}`}
                style={{ width: `${passwordStrength.percent}%` }}
              />
            </div>
            <span
              className={`password-strength-label password-strength-label--${passwordStrength.level}`}
            >
              {passwordStrength.label}
            </span>
          </div>
        </div>
        <div className="register-field">
          <label htmlFor="register-confirm-password">Confirm password</label>
          <input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordInput(e.target.value)}
            onBlur={() => handleRegisterFieldBlur("confirmPassword")}
            disabled={isLoading}
            autoComplete="new-password"
            placeholder="Repeat password"
            aria-invalid={Boolean(fieldErrors.confirmPassword)}
            aria-describedby={
              fieldErrors.confirmPassword
                ? "register-confirm-password-error"
                : undefined
            }
            required
          />
          {fieldErrors.confirmPassword && (
            <p
              id="register-confirm-password-error"
              className="register-field-error"
            >
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="register-btn"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="register-switch">
        Already have an account? <Link to={APP_ROUTES.LOGIN}>Sign in</Link>
      </p>
    </section>
  );
}

function getRegisterFieldErrors(
  issues: readonly { path: readonly unknown[]; message: string }[],
): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};

  for (const field of REGISTER_FIELDS) {
    const message = getFieldMessage(issues, field);

    if (message) {
      errors[field] = message;
    }
  }

  return errors;
}

function getFieldMessage(
  issues: readonly { path: readonly unknown[]; message: string }[],
  field: RegisterFieldName,
): string | null {
  return issues.find((issue) => issue.path[0] === field)?.message ?? null;
}
