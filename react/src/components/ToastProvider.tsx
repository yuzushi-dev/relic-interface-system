'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Toast, ToastData, ToastVariant, ToastAction } from './Toast.js';

export interface ToastOptions {
  id?: string;
  title: string;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
  timestamp?: string;
}

export interface ToastContextValue {
  toast: {
    (options: ToastOptions | string): string;
    hud: (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>) => string;
    success: (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>) => string;
    danger: (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>) => string;
    warning: (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>) => string;
    info: (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>) => string;
    dismiss: (id: string) => void;
    clear: () => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Global subscribers for imperative toast.* calls outside React tree (Sonner style)
type ToastSubscriber = (toast: ToastOptions) => string;
type DismissSubscriber = (id: string) => void;
type ClearSubscriber = () => void;

let globalAddToast: ToastSubscriber | null = null;
let globalDismissToast: DismissSubscriber | null = null;
let globalClearToasts: ClearSubscriber | null = null;

function formatTimestamp(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

/**
 * Imperative `toast` dispatcher usable anywhere in the application.
 */
export const toast = (options: ToastOptions | string): string => {
  if (globalAddToast) {
    const opts = typeof options === 'string' ? { title: options } : options;
    return globalAddToast(opts);
  }
  console.warn('[Relic UI] Toast was called before <ToastProvider /> mounted.');
  return '';
};

toast.hud = (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>): string => {
  return toast({ ...options, title, variant: 'hud' });
};

toast.success = (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>): string => {
  return toast({ ...options, title, variant: 'success' });
};

toast.danger = (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>): string => {
  return toast({ ...options, title, variant: 'danger' });
};

toast.warning = (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>): string => {
  return toast({ ...options, title, variant: 'warning' });
};

toast.info = (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>): string => {
  return toast({ ...options, title, variant: 'info' });
};

toast.dismiss = (id: string): void => {
  globalDismissToast?.(id);
};

toast.clear = (): void => {
  globalClearToasts?.();
};

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum number of toasts displayed simultaneously (default: 5) */
  maxToasts?: number;
  /** Default auto-dismiss timeout in ms (default: 4000ms per RIS guidelines) */
  defaultDuration?: number;
}

/**
 * Tactical Toast Stack Provider (`.ris-toast-stack`).
 * Mounts the accessible live region and orchestrates auto-dismiss timers,
 * hover pauses, tab visibility pauses, and cascading dismiss animations.
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  defaultDuration = 4000,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const isHovered = useRef(false);
  const timeouts = useRef<Map<string, { timerId: ReturnType<typeof setTimeout>; remaining: number; startedAt: number }>>(new Map());

  const dismiss = useCallback((id: string) => {
    // Mark as dismissing for smooth exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDismissing: true } : t))
    );

    const timer = timeouts.current.get(id);
    if (timer) {
      clearTimeout(timer.timerId);
      timeouts.current.delete(id);
    }

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 160);
  }, []);

  const clear = useCallback(() => {
    timeouts.current.forEach(({ timerId }) => clearTimeout(timerId));
    timeouts.current.clear();
    setToasts([]);
  }, []);

  const addToast = useCallback(
    (options: ToastOptions | string): string => {
      const opts: ToastOptions = typeof options === 'string' ? { title: options } : options;
      const id = opts.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const duration = opts.duration ?? defaultDuration;
      const timestamp = opts.timestamp || formatTimestamp();

      const newToast: ToastData = {
        id,
        title: opts.title,
        description: opts.description,
        variant: opts.variant || 'hud',
        duration,
        action: opts.action,
        timestamp,
        isDismissing: false,
      };

      setToasts((prev) => {
        const next = [newToast, ...prev];
        return next.slice(0, maxToasts);
      });

      if (duration > 0) {
        const timerId = setTimeout(() => {
          if (!isHovered.current && document.visibilityState !== 'hidden') {
            dismiss(id);
          }
        }, duration);

        timeouts.current.set(id, {
          timerId,
          remaining: duration,
          startedAt: Date.now(),
        });
      }

      return id;
    },
    [defaultDuration, dismiss, maxToasts]
  );

  // Hook up global singleton functions
  useEffect(() => {
    globalAddToast = addToast;
    globalDismissToast = dismiss;
    globalClearToasts = clear;

    return () => {
      globalAddToast = null;
      globalDismissToast = null;
      globalClearToasts = null;
    };
  }, [addToast, dismiss, clear]);

  // Pause timers when tab visibility is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        timeouts.current.forEach((t) => clearTimeout(t.timerId));
      } else {
        timeouts.current.forEach((t, id) => {
          const timerId = setTimeout(() => dismiss(id), t.remaining);
          timeouts.current.set(id, { ...t, timerId, startedAt: Date.now() });
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [dismiss]);

  const handleMouseEnter = () => {
    isHovered.current = true;
    timeouts.current.forEach((t) => clearTimeout(t.timerId));
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    timeouts.current.forEach((t, id) => {
      const elapsed = Date.now() - t.startedAt;
      const remaining = Math.max(1000, t.remaining - elapsed);
      const timerId = setTimeout(() => dismiss(id), remaining);
      timeouts.current.set(id, { timerId, remaining, startedAt: Date.now() });
    });
  };

  const contextApi = {
    toast: Object.assign(addToast, {
      hud: (title: string, opts?: Omit<ToastOptions, 'title' | 'variant'>) =>
        addToast({ ...opts, title, variant: 'hud' }),
      success: (title: string, opts?: Omit<ToastOptions, 'title' | 'variant'>) =>
        addToast({ ...opts, title, variant: 'success' }),
      danger: (title: string, opts?: Omit<ToastOptions, 'title' | 'variant'>) =>
        addToast({ ...opts, title, variant: 'danger' }),
      warning: (title: string, opts?: Omit<ToastOptions, 'title' | 'variant'>) =>
        addToast({ ...opts, title, variant: 'warning' }),
      info: (title: string, opts?: Omit<ToastOptions, 'title' | 'variant'>) =>
        addToast({ ...opts, title, variant: 'info' }),
      dismiss,
      clear,
    }),
  };

  return (
    <ToastContext.Provider value={contextApi}>
      {children}
      {toasts.length > 0 && (
        <div
          role="status"
          aria-live="polite"
          className="ris-toast-stack"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue['toast'] {
  const context = useContext(ToastContext);
  if (!context) {
    // If used outside provider, fallback to imperative singleton
    return toast as unknown as ToastContextValue['toast'];
  }
  return context.toast;
}

ToastProvider.displayName = 'ToastProvider';
