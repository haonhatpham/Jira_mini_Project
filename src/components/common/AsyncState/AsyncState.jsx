import "./AsyncState.css";

export default function AsyncState({
  status,
  error,
  onRetry,
  emptyMessage = "No data found.",
  loadingMessage = "Loading…",
  children,
}) {
  if (status === "loading") {
    return <p className="async-state loading">{loadingMessage}</p>;
  }

  if (status === "error") {
    return (
      <div className="async-state error">
        <p>{error}</p>
        {onRetry && (
          <button type="button" className="async-retry-btn" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    );
  }

  if (status === "empty") {
    return <p className="async-state empty">{emptyMessage}</p>;
  }

  if (status === "data") {
    return children;
  }

  return null;
}
