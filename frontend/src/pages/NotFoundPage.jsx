import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>The route you requested does not exist.</p>
      <Link to="/" className="not-found-link">
        Go to Home
      </Link>
    </section>
  );
}
