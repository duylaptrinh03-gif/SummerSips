// src/components/providers/SessionSync.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/useUserStore";

/**
 * SessionSync: Đọc session từ NextAuth và đồng bộ vào Zustand store.
 * Đặt component này bên trong SessionProvider.
 */
export function SessionSync() {
  const { data: session, status } = useSession();
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        role: session.user.role,
        accessToken: session.accessToken,
      });
    } else if (status === "unauthenticated") {
      clearUser();
    }
  }, [status, session, setUser, clearUser]);

  return null;
}
