"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";

interface ConfirmModalProps {
  titulo: string;
  mensagem: ReactNode;
  textoConfirmar?: string;
  textoCancelar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmModal({
  titulo,
  mensagem,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  onConfirmar,
  onCancelar,
}: ConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const focusable = node.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    first?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancelar();
      if (e.key !== "Tab" || focusable.length === 0) return;
      const focusArray = Array.from(focusable);
      const idx = focusArray.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey) {
        if (idx === 0) {
          focusArray[focusArray.length - 1].focus();
          e.preventDefault();
        }
      } else {
        if (idx === focusArray.length - 1) {
          focusArray[0].focus();
          e.preventDefault();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancelar]);
  async function handleConfirm() {
    try {
      setLoading(true);
      await onConfirmar();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden="true"
        onClick={onCancelar}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        ref={containerRef}
        className="relative w-full max-w-md bg-surface-container rounded-2xl p-6 shadow-lg"
      >
        <div className="flex flex-col gap-2 text-center">
          <h3
            id="confirm-title"
            className="text-2xl font-serif text-primary"
          >
            {titulo}
          </h3>
          <p className="text-on-surface-60 text-sm leading-relaxed">
            {mensagem}
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={handleConfirm}
            loading={loading}
            className="bg-error hover:brightness-110 text-on-error font-bold py-3 rounded-lg transition-all text-sm focus-ring"
          >
            {textoConfirmar}
          </Button>

          <Button
            onClick={onCancelar}
            variant="secondary"
            className="w-full text-sm focus-ring"
            aria-label="Cancelar ação"
          >
            {textoCancelar}
          </Button>
        </div>
      </div>
    </div>
  );
}
