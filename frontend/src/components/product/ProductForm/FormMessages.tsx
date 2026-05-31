import type { ReactNode } from "react";

export type FormErrorEntry = [string, ReactNode];

interface FormMessagesProps {
  errorEntries: FormErrorEntry[];
  showSummary: boolean;
  successMessage: string | null;
  submitError: string | null;
}

export default function FormMessages({
  errorEntries,
  showSummary,
  successMessage,
  submitError,
}: FormMessagesProps) {
  return (
    <>
      {showSummary && (
        <div className="form-error-summary" role="alert">
          <strong>Please fix {errorEntries.length} error(s):</strong>
          <ul>
            {errorEntries.map(([key, message]) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {successMessage && (
        <p className="form-success" role="status">
          {successMessage}
        </p>
      )}

      {submitError && (
        <p className="form-submit-error" role="alert">
          {submitError}
        </p>
      )}
    </>
  );
}
