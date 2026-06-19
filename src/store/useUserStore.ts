// src/store/useUserStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: string;
  accessToken?: string;
}

interface UserState {
  user: UserProfile | null;
  isHydrated: boolean;
  // Actions
  setUser: (user: UserProfile | null) => void;
  clearUser: () => void;
  setHydrated: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "summersips-user-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
