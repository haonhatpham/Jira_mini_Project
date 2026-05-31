import type { ReactNode } from "react";
import type { AsyncStatus } from "../../../types";
import "./AsyncState.css";

interface AsyncStateProps {
  status: AsyncStatus;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  loadingMessage?: string;
  children: ReactNode;
}

export default function AsyncState({
  status,
  error,
  onRetry,
  emptyMessage = "No data found.",
  loadingMessage = "Loading...",
  children,
}: AsyncStateProps) {
  if (status === "loading") {
    return (
      <div className="async-state loading" role="status">
        <span className="async-spinner" aria-hidden="true" />
        <p>{loadingMessage}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="async-state error">
        <p>{error || "Something went wrong."}</p>
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
