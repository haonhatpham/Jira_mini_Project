import { Headphones, PackageCheck, ShieldCheck } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>
            <span>ECM</span> Shop
          </h2>
          <p>
            Modern ecommerce experience with premium products and fast delivery.
          </p>
          <div className="footer-badges" aria-label="Store services">
            <span>
              <ShieldCheck aria-hidden="true" className="footer-icon" />
              Secure checkout
            </span>
            <span>
              <PackageCheck aria-hidden="true" className="footer-icon" />
              Live inventory
            </span>
            <span>
              <Headphones aria-hidden="true" className="footer-icon" />
              Fast support
            </span>
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <div>
            <h3>Shop</h3>
            <a href="#products-container">New arrivals</a>
            <a href="#products-container">Best sellers</a>
            <a href="#products-container">Sale</a>
          </div>
          <div>
            <h3>Support</h3>
            <a href="#products-container">Help center</a>
            <a href="#products-container">Shipping</a>
            <a href="#products-container">Returns</a>
          </div>
          <div>
            <h3>Company</h3>
            <a href="#products-container">About</a>
            <a href="#products-container">Careers</a>
            <a href="#products-container">Privacy</a>
          </div>
        </nav>
      </div>
    </footer>
  );
}
