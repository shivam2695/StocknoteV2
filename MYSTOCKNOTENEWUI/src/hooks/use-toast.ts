import * as React from "react";

// Simple toast types
export interface ToastProps {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
}

type ToasterToast = ToastProps & {
  id: string;
  open?: boolean;
};

// Simple state management
let toasts: ToasterToast[] = [];
let listeners: Array<(toasts: ToasterToast[]) => void> = [];

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

function addToast(toast: ToastProps) {
  const id = genId();
  const newToast: ToasterToast = {
    ...toast,
    id,
    open: true,
  };

  toasts = [newToast, ...toasts];
  listeners.forEach((listener) => listener(toasts));

  // Auto dismiss after duration
  setTimeout(() => {
    dismissToast(id);
  }, toast.duration || 5000);

  return {
    id,
    dismiss: () => dismissToast(id),
  };
}

function dismissToast(toastId: string) {
  toasts = toasts.filter((toast) => toast.id !== toastId);
  listeners.forEach((listener) => listener(toasts));
}

function toast(props: ToastProps) {
  return addToast(props);
}

function useToast() {
  const [state, setState] = React.useState<ToasterToast[]>(toasts);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    toasts: state,
    toast,
    dismiss: dismissToast,
  };
}

export { useToast, toast };
