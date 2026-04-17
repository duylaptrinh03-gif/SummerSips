"use client";

import { HTMLAttributes } from "react";

// Shimmer skeleton base
export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`shimmer rounded-xl ${className}`}
      {...props}
    />
  );
}

// Full product card skeleton
export function ProductCardSkeleton() {
  return (
    <div
      className="rounded-3xl overflow-hidden border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
    >
      {/* Image area */}
      <div className="h-48 w-full shimmer" />
      {/* Content */}
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-10 !rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Grid of skeletons for loading state
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
