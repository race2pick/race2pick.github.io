import {
  useMemo,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { ToastContext, type Toast, type ToastType } from "./toast-context";
import { cn } from "@/lib/utils";

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function ToastProvider({
  children,
  duration = 2500,
}: {
  children: ReactNode;
  duration?: number;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback(
    (message: string, type: ToastType = "normal") => {
      const id = generateId();
      setToasts((s) => [...s, { id, message, type, duration }]);
      return id;
    },
    [duration]
  );

  const remove = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const contextValue = useMemo(() => ({ add }), [add]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  );
}

function ToastViewport({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed z-50 bottom-4 right-4 flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={() => onRemove(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) {
  const { id, message, type, duration } = toast;

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => onRemove(), duration);
    return () => clearTimeout(timer);
  }, [duration, id, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn("shadow rounded p-3 text-sm font-mono w-auto", {
        "bg-yellow-100 border-yellow-300 text-yellow-800": type === "warning",
        "bg-gray-500 border-gray-300 text-gray-300": type === "normal",
      })}
    >
      {message}
    </motion.div>
  );
}
