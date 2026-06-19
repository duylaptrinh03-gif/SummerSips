"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/useUserStore";
import { socketService } from "@/lib/socketService";

const SocketContext = createContext<Socket | null>(null);

export function useSocket(): Socket | null {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const zustandToken = useUserStore((s) => s.user?.accessToken);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Ưu tiên session.accessToken (NestJS JWT), fallback về Zustand
  const accessToken = session?.accessToken ?? zustandToken;

  useEffect(() => {
    // Chờ session load xong mới quyết định (tránh disconnect sớm)
    if (status === "loading") return;

    console.log("[Socket] status:", status, "| accessToken:", accessToken ? "present" : "MISSING");

    if (accessToken) {
      const s = socketService.connect(accessToken);
      setSocket(s);
      console.log("[Socket] connect() called, socket id:", s.id ?? "(pending)");
    } else {
      socketService.disconnect();
      setSocket(null);
      console.log("[Socket] disconnected — no token");
    }
  }, [accessToken, status]);

  useEffect(() => {
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
