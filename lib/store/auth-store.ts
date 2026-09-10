import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AdminUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "SUPER_ADMIN";
};

type AuthState = {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  // True once zustand has finished reading the persisted session back out of
  // sessionStorage on page load. AuthGuard must wait for this before deciding
  // whether to redirect to login, otherwise it sees the brief pre-hydration
  // "not logged in" state and kicks out an already-logged-in admin on every
  // page reload.
  hasHydrated: boolean;
  setAuth: (user: AdminUser, token: string) => void;
  clearAuth: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      // sessionStorage, not localStorage: prevents one admin's login in a
      // second tab from silently overwriting another admin's session on the
      // same browser. Trade-off: closing a tab ends that session.
      name: "admin-auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
