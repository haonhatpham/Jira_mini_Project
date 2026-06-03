import { X } from "lucide-react";
import { useEffect } from "react";
import {
  selectDismissToast,
  selectToasts,
  type ToastMessage,
  useToastStore,
} from "../../../stores/toastStore";
import "./ToastViewport.css";

const TOAST_DURATION_MS = 3200;

export default function ToastViewport() {
  const toasts = useToastStore(selectToasts);
  const dismissToast = useToastStore(selectDismissToast);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-viewport" aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  onDismiss: (id: string) => void;
  toast: ToastMessage;
}

function ToastItem({ onDismiss, toast }: ToastItemProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onDismiss(toast.id);
    }, TOAST_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [onDismiss, toast.id]);

  return (
    <div className={`toast toast-${toast.variant}`} role="status">
      <div className="toast-content">
        <strong>{toast.title}</strong>
        {toast.description && <span>{toast.description}</span>}
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
