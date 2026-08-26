"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Info, Sparkles, X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  progress: number;
}

interface ToastContextType {
  toast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const TOAST_DURATION = 3200;

function ToastItem({ toast: t, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / TOAST_DURATION) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setIsExiting(true);
        setTimeout(() => onRemove(t.id), 300);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [t.id, onRemove]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl sm:rounded-full border shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 pointer-events-auto",
        isExiting
          ? "opacity-0 -translate-y-2 scale-95"
          : "opacity-100 translate-y-0 scale-100 animate-slide-up",
        t.type === "success" && "bg-neutral-950/95 text-white border-white/15",
        t.type === "error" && "bg-neutral-950/95 text-white border-rose-500/40",
        t.type === "info" && "bg-neutral-950/95 text-white border-white/15"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3">
        {/* Luxury Gold/Status Badge */}
        {t.type === "success" && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C5A869]/20 border border-[#C5A869]/40 text-[#DFCA9B]">
            <Check className="w-3.5 h-3.5" />
          </div>
        )}
        {t.type === "error" && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        )}
        {t.type === "info" && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C5A869]/20 border border-[#C5A869]/40 text-[#DFCA9B]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        )}

        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-neutral-100 leading-snug">
            {t.message}
          </p>
        </div>

        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => onRemove(t.id), 200);
          }}
          className="text-neutral-400 hover:text-white p-1 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Luxury Champagne Gold Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <div
          className={cn(
            "h-full transition-all duration-100 ease-linear",
            t.type === "success" && "bg-gradient-to-r from-[#A88B4D] to-[#DFCA9B]",
            t.type === "error" && "bg-rose-500",
            t.type === "info" && "bg-gradient-to-r from-[#A88B4D] to-[#DFCA9B]"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev.slice(-2), { id, message, type, progress: 100 }]);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Floating Luxury Toast Container */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[120] pointer-events-none flex flex-col items-center gap-2 w-[92vw] max-w-md">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { toast: () => {} };
  }
  return context;
}
