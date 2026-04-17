import { create } from "zustand";
import { Toast, ToastVariant } from "@/types/ui";

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, variant?: ToastVariant, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

let toastCounter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (message, variant = "success", duration = 3000) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    const newToast: Toast = { id, message, variant, duration };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto-remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  clearToasts: () => set({ toasts: [] }),
}));
