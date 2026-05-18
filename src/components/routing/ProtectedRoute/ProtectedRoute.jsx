import { Navigate, useLocation } from "react-router-dom";
import { selectIsLoggedIn, useAuthStore } from "../../../stores/authStore";

export default function ProtectedRoute({ children }) {
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
