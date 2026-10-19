import React, { useCallback, useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

type Listener = (toast: ToastMessage) => void;

let listeners: Listener[] = [];
let idCounter = 0;

export function showToast(message: string, type: ToastType = 'success') {
  const toast: ToastMessage = { id: ++idCounter, message, type };
  listeners.forEach((listener) => listener(toast));
}

const ICONS: Record<ToastType, string> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
};

const COLORS: Record<ToastType, string> = {
  success: 'bg-ghana-green border-green-dark',
  error: 'bg-primary border-primary-dark',
  info: 'bg-[#111418] border-black',
};

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler: Listener = (toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => remove(toast.id), 6000);
    };
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, [remove]);

  return (
    <div
      className="fixed bottom-4 right-4 left-4 sm:left-auto z-100 flex flex-col gap-3 sm:w-full sm:max-w-sm"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`${COLORS[toast.type]} text-white rounded-xl shadow-2xl border-2 px-4 py-3 flex items-start gap-3 animate-in slide-in-from-bottom-4 fade-in duration-300`}
        >
          <span className="material-symbols-outlined shrink-0" aria-hidden="true">
            {ICONS[toast.type]}
          </span>
          <p className="text-sm font-semibold leading-snug">{toast.message}</p>
          <button
            type="button"
            onClick={() => remove(toast.id)}
            aria-label="Dismiss notification"
            className="ml-auto shrink-0 hover:opacity-75 focus-visible:opacity-75"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
