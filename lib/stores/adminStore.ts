import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AdminState {
  isAuthenticated: boolean;
  user: any | null;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: null,
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        logout: () => set({ user: null, isAuthenticated: false }),
      }),
      {
        name: 'admin-store',
      }
    )
  )
);