import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../configs/routes.config";
import { NOT_FOUND_STATUS_CODE } from "../../configs/ui.config";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <h1>{NOT_FOUND_STATUS_CODE}</h1>
      <h2>Page not found</h2>
      <p>The route you requested does not exist.</p>
      <Link to={APP_ROUTES.HOME} className="not-found-link">
        Go to Home
      </Link>
    </section>
  );
}
