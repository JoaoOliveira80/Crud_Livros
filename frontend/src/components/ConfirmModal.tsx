"use client";

import { ReactNode } from "react";

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
  return (
    <div
      className="fixed inset-0 bg-on-surface-20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancelar}
    >
      <div
        className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient max-w-sm w-full flex flex-col gap-6 transform transition-all animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2 text-center">
          <h3 className="text-2xl font-serif text-primary">{titulo}</h3>
          <p className="text-on-surface-60 text-sm leading-relaxed">
            {mensagem}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirmar}
            className="bg-error hover:brightness-110 text-on-error font-bold py-3 rounded-lg transition-all text-sm"
          >
            {textoConfirmar}
          </button>
          <button
            onClick={onCancelar}
            className="btn-secondary w-full text-sm"
          >
            {textoCancelar}
          </button>
        </div>
      </div>
    </div>
  );
}
