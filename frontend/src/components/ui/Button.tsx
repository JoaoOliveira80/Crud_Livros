"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
};

const VARIANT_CLASS: Record<string, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  ghost: "btn",
};

export default function Button({
  variant = "primary",
  loading = false,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const base = VARIANT_CLASS[variant] || VARIANT_CLASS.primary;
  return (
    <button
      {...rest}
      className={`${base} ${className}`.trim()}
      disabled={loading || rest.disabled}
    >
      {loading && (
        <span
          className="spinner mr-2"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
