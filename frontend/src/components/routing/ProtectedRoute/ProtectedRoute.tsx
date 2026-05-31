import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  selectIsAdmin,
  selectIsLoggedIn,
  useAuthStore,
} from "../../../stores/authStore";

interface ProtectedRouteProps {
  adminOnly?: boolean;
  children: ReactNode;
}

export default function ProtectedRoute({
  adminOnly = false,
  children,
}: ProtectedRouteProps) {
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const isAdmin = useAuthStore(selectIsAdmin);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: "Please sign in with the admin account to add products.",
        }}
        replace
      />
    );
  }

  return children;
}
