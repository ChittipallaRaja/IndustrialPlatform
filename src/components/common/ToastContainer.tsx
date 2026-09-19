import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { usePlatform, ToastItem } from '../../context/PlatformContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePlatform();

  if (toasts.length === 0) return null;

  const iconMap: Record<ToastItem['type'], React.ReactNode> = {
    success: <CheckCircle2 size={18} className="text-healthy" />,
    error: <AlertCircle size={18} className="text-critical" />,
    warning: <AlertTriangle size={18} className="text-brand" />,
    info: <Info size={18} className="text-brand" />,
  };

  return (
    <div className="toast-container" role="region" aria-label="System notifications" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div style={{ flexShrink: 0 }}>{iconMap[toast.type]}</div>
          <div className="flex flex-col gap-1 flex-1">
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {toast.title}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {toast.message}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ padding: '2px', marginLeft: 'auto' }}
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
