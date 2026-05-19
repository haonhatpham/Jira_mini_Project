export default function FormMessages({
  errorEntries,
  showSummary,
  successMessage,
  submitError,
}) {
  return (
    <>
      {showSummary && (
        <div className="form-error-summary" role="alert">
          <strong>Please fix {errorEntries.length} error(s):</strong>
          <ul>
            {errorEntries.map(([key, err]) => (
              <li key={key}>{err.message}</li>
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
