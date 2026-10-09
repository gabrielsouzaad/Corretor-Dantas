import { useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function readSavedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    console.warn("Não foi possível salvar o tema neste navegador.");
  }
}

function getInitialTheme(): Theme {
  const saved = readSavedTheme();

  if (saved) {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", next);
    saveTheme(next);
    setTheme(next);
  }

  return { theme, toggleTheme };
}