import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./Header.css";

export default function Header({ cartCount }) {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <NavLink to="/" className="header-logo">
           Shop Test
        </NavLink>

        <nav className="header-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Cart
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </NavLink>
          {isLoggedIn ? (
            <button type="button" className="nav-btn" onClick={logout}>
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
