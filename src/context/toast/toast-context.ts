import { createContext, useContext } from "react";

export type ToastType = "normal" | "warning";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
};

type ToastContextValue = {
  add: (message: string, type?: ToastType) => string;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");

  return {
    show: (msg: string) => ctx.add(msg, "normal"),
    warn: (msg: string) => ctx.add(msg, "warning"),
  };
}

export { ToastContext, useToast };
