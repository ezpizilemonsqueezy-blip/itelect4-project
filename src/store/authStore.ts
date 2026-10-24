import { create } from "zustand";
import { persist, type PersistOptions } from "zustand/middleware";

export interface AuthState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

type AuthPersist = PersistOptions<AuthState>;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      login: (token: string) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: "campus-recovery-auth",
      partialize: (state) => ({ token: state.token }),
    } as AuthPersist
  )
);
