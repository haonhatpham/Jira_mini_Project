import { LayoutDashboard, ShoppingCart } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { selectCartCount, useCartStore } from "../../../stores/cartStore";
import {
  selectIsAdmin,
  selectIsLoggedIn,
  selectLogout,
  useAuthStore,
} from "../../../stores/authStore";
import { selectShowToast, useToastStore } from "../../../stores/toastStore";
import { APP_ROUTES } from "../../../configs/routes.config";
import { UI_COUNTS } from "../../../configs/ui.config";
import "./Header.css";

export default function Header() {
  const cartCount = useCartStore(selectCartCount);
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const isAdmin = useAuthStore(selectIsAdmin);
  const logout = useAuthStore(selectLogout);
  const showToast = useToastStore(selectShowToast);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showToast({
      title: "Signed out",
      description: "You have been logged out.",
      variant: "info",
    });
    navigate(APP_ROUTES.LOGIN, { replace: true });
  };

  return (
    <header className="header">
      <div className="header-container">
        <NavLink
          to={APP_ROUTES.HOME}
          className="header-logo"
          aria-label="ECM Shop home"
        >
          <span className="logo-text">
            <span>ECM</span> Shop
          </span>
        </NavLink>

        <div className="header-actions">
          {isAdmin && (
            <NavLink
              to={APP_ROUTES.DASHBOARD}
              className={({ isActive }) =>
                isActive ? "dashboard-link active" : "dashboard-link"
              }
            >
              <LayoutDashboard aria-hidden="true" className="dashboard-icon" />
              <span>Dashboard</span>
            </NavLink>
          )}
          <NavLink
            to={APP_ROUTES.CART}
            className={({ isActive }) =>
              isActive ? "icon-link active" : "icon-link"
            }
            aria-label="Cart"
          >
            <ShoppingCart aria-hidden="true" className="nav-icon" />
            {cartCount > UI_COUNTS.EMPTY && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </NavLink>
          {isLoggedIn ? (
            <button
              type="button"
              className="auth-link icon-button"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <span>Logout</span>
            </button>
          ) : (
            <>
              <NavLink
                to={APP_ROUTES.REGISTER}
                className={({ isActive }) =>
                  isActive ? "auth-link active" : "auth-link"
                }
                aria-label="Register"
              >
                <span>Register</span>
              </NavLink>
              <NavLink
                to={APP_ROUTES.LOGIN}
                state={{ from: location }}
                className={({ isActive }) =>
                  isActive ? "auth-link active" : "auth-link"
                }
                aria-label="Login"
              >
                <span>Login</span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
