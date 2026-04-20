"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useState đảm bảo QueryClient không bị share giữa các requests (SSR safety)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Sau khi window focus, refetch nếu data stale
            refetchOnWindowFocus: false, // Override per-hook khi cần
            // Retry 1 lần trước khi báo lỗi (tránh spam API khi server down)
            retry: 1,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10_000),
          },
          mutations: {
            retry: 0, // Mutations không retry tự động
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
