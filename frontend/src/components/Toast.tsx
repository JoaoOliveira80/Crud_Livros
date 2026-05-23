"use client";

import { useEffect } from "react";

interface ToastProps {
  aviso: string;
  onFechar: () => void;
}

export default function Toast({ aviso, onFechar }: ToastProps) {
  useEffect(() => {
    if (!aviso) return;
    const timer = setTimeout(onFechar, 3000);
    return () => clearTimeout(timer);
  }, [aviso, onFechar]);

  if (!aviso) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-6 py-3 rounded-full shadow-ambient z-50 flex items-center gap-3 border border-primary-30"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="text-sm font-medium">{aviso}</span>
      <button
        onClick={onFechar}
        className="btn opacity-70 hover:opacity-100 text-on-primary"
        aria-label="Fechar aviso"
      >
        ✕
      </button>
    </div>
  );
}
