import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";
import Footer from "./components/layout/Footer/Footer";
import Header from "./components/layout/Header/Header";
import ProtectedRoute from "./components/routing/ProtectedRoute/ProtectedRoute";
import { APP_ROUTES } from "./configs/routes.config";
import CartPage from "./pages/Cart/CartPage";
import CreateProductPage from "./pages/CreateProduct/CreateProductPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import EditProductPage from "./pages/EditProduct/EditProductPage";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import ProductDetailPage from "./pages/ProductDetail/ProductDetailPage";
import RegisterPage from "./pages/Register/RegisterPage";
import "./App.css";

function withBoundary(page: ReactNode) {
  return <ErrorBoundary>{page}</ErrorBoundary>;
}

function AppContent() {
  return (
    <>
      {withBoundary(<Header />)}

      <Routes>
        <Route path={APP_ROUTES.HOME} element={withBoundary(<HomePage />)} />
        <Route
          path={APP_ROUTES.NEW_PRODUCT}
          element={withBoundary(
            <ProtectedRoute adminOnly>
              <CreateProductPage />
            </ProtectedRoute>,
          )}
        />
        <Route
          path={APP_ROUTES.DASHBOARD}
          element={withBoundary(
            <ProtectedRoute adminOnly>
              <DashboardPage />
            </ProtectedRoute>,
          )}
        />
        <Route
          path={APP_ROUTES.PRODUCT_EDIT}
          element={withBoundary(
            <ProtectedRoute adminOnly>
              <EditProductPage />
            </ProtectedRoute>,
          )}
        />
        <Route
          path={APP_ROUTES.PRODUCT_DETAIL}
          element={withBoundary(<ProductDetailPage />)}
        />
        <Route path={APP_ROUTES.CART} element={withBoundary(<CartPage />)} />
        <Route path={APP_ROUTES.LOGIN} element={withBoundary(<LoginPage />)} />
        <Route
          path={APP_ROUTES.REGISTER}
          element={withBoundary(<RegisterPage />)}
        />
        <Route path="*" element={withBoundary(<NotFoundPage />)} />
      </Routes>

      {withBoundary(<Footer />)}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
