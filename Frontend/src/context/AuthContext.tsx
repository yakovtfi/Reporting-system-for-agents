import { useEffect } from "react";
import type { ReactNode } from "react";
import { create } from "zustand";
import api from "../services/api";

export type Role = "admin" | "agent" ;

export interface User {
  id: string;
  agentCode: string;
  fullName: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (agentCode: string, password: string) => Promise<void>;
  logout: () => void;
  init: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: true,
  login: async (agentCode: string, password: string) => {
    const { data } = await api.post("/auth/login", { agentCode, password });
    localStorage.setItem("token", data.token);
    set({ token: data.token, user: data.user });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
  init: async () => {
    const { token } = get();
    if (!token) {
      set({ loading: false });
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user, loading: false });
    } catch (_err) {
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
    }
  },
}));

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return <>{children}</>;
};

export const useAuth = () => useAuthStore((state) => state);
