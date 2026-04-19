"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "·",
};

const COLORS: Record<ToastType, string> = {
  success: "border-[#00E5CC]/30 bg-[#00E5CC]/8 text-[#00E5CC]",
  error:   "border-[#FF5F57]/30 bg-[#FF5F57]/8 text-[#FF5F57]",
  info:    "border-[#3D4148] bg-[#0D0F14] text-[#A0A8B4]",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = nextId.current++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border text-[13px] font-medium max-w-sm shadow-lg shadow-black/40 ${COLORS[toast.type]}`}
            >
              <span className="font-mono text-[11px] mt-0.5 flex-shrink-0">{ICONS[toast.type]}</span>
              <span className="text-[#F0F2F5] leading-snug">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
