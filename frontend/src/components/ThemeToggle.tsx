"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/ui/Button";

type ThemeToggleVariant = "icon" | "switch";

interface ThemeToggleProps {
  variant?: ThemeToggleVariant;
  className?: string;
}

function ThemeIcon({ theme }: { theme: "light" | "dark" }) {
  if (theme === "light") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

export default function ThemeToggle({
  variant = "icon",
  className = "",
}: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  const ariaLabel = !mounted
    ? "Alternar tema"
    : theme === "light"
      ? "Alternar para modo escuro"
      : "Alternar para modo claro";

  if (variant === "switch") {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={mounted ? theme === "dark" : false}
        aria-label={ariaLabel}
        onClick={toggleTheme}
        disabled={!mounted}
        className={`w-14 h-7 rounded-full relative transition-colors focus-ring disabled:cursor-default ${
          mounted && theme === "dark"
            ? "bg-primary"
            : "bg-surface-container-high"
        } ${className}`}
      >
        <span
          className={`absolute top-1 w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm transition-transform duration-200 ${
            mounted && theme === "dark" ? "translate-x-8" : "translate-x-1"
          }`}
        />
      </button>
    );
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      disabled={!mounted}
      className={`p-2 rounded-lg transition-colors hover:bg-surface-container-low text-on-surface-60 hover:text-primary focus-ring ${className}`}
      aria-label={ariaLabel}
    >
      {mounted ? (
        <ThemeIcon theme={theme} />
      ) : (
        <span className="block w-5 h-5" aria-hidden />
      )}
    </Button>
  );
}
