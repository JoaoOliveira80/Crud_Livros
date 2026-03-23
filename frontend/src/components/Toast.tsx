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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-full shadow-lg z-50 animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3">
      <span className="text-sm font-medium">{aviso}</span>
      <button
        onClick={onFechar}
        className="text-white-60 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}
