import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string | false | undefined;
  children: ReactNode;
  hint?: string;
  required?: boolean;
}

export default function FormField({
  id,
  label,
  error,
  children,
  hint,
  required = false,
}: FormFieldProps) {
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
