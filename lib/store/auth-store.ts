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
  setAuth: (user: AdminUser, token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      // sessionStorage, not localStorage: prevents one admin's login in a
      // second tab from silently overwriting another admin's session on the
      // same browser. Trade-off: closing a tab ends that session.
      name: "admin-auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
