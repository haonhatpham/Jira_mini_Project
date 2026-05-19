export default function FormField({
  id,
  label,
  error,
  children,
  hint,
  required = false,
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </label>
      {children}
      {error && <span className="field-error">{error}</span>}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}
