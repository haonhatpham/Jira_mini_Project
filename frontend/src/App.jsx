import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary.jsx";
import Header from "./components/layout/Header/Header.jsx";
import ProtectedRoute from "./components/routing/ProtectedRoute/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import CreateProductPage from "./pages/CreateProductPage";
import "./App.css";

function withBoundary(page) {
  return <ErrorBoundary>{page}</ErrorBoundary>;
}

function AppContent() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={withBoundary(<HomePage />)} />
        <Route path="/products/new" element={withBoundary(<CreateProductPage />)} />
        <Route path="/products/:id" element={withBoundary(<ProductDetailPage />)} />
        <Route
          path="/cart"
          element={
            withBoundary(
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>,
            )
          }
        />
        <Route path="/login" element={withBoundary(<LoginPage />)} />
        <Route path="*" element={withBoundary(<NotFoundPage />)} />
      </Routes>
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
