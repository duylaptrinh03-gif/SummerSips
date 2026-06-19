"use client";

import { io, Socket } from "socket.io-client";

// Derive socket URL từ NEXT_PUBLIC_API_URL bằng cách bỏ "/api/v1"
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "")
    : "http://localhost:3001");

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): Socket {
    if (this.socket?.connected) return this.socket;

    // Disconnect stale socket nếu có
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("[Socket] ✅ Connected! id:", this.socket?.id, "| URL:", SOCKET_URL);
    });

    this.socket.on("connect_error", (err) => {
      console.error("[Socket] ❌ Connection error:", err.message, "| URL:", SOCKET_URL);
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("[Socket] ⚠️ Disconnected:", reason);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Singleton — dùng chung trong toàn app
export const socketService = new SocketService();
