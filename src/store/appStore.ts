import { create } from "zustand";

type Theme = "dark" | "light";

interface AppState {
  sidebarCollapsed: boolean;
  theme: Theme;
  notifications: number;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  theme: "dark",
  notifications: 14,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  clearNotifications: () => set({ notifications: 0 })
}));
