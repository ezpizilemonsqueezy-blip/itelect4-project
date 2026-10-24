import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

export interface UiState {
  searchTerm: string;
  theme: ThemeMode;
  setSearchTerm: (value: string) => void;
  setTheme: (value: ThemeMode) => void;
  toggleTheme: () => void;
}

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem("theme-mode");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      searchTerm: "",
      theme: getPreferredTheme(),
      setSearchTerm: (value: string) => set({ searchTerm: value }),
      setTheme: (value: ThemeMode) => set({ theme: value }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: "campus-recovery-desk-ui",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
