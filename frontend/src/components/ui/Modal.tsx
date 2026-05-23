"use client";

import React from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  labelledBy?: string;
}

export default function Modal({ children, onClose, labelledBy }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-on-surface-20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="bg-surface border-none shadow-ambient rounded-2xl w-full max-w-lg p-8 flex flex-col gap-8 transform transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
