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

// Horizontal recommendation card skeleton
export function RecoCardSkeleton() {
  return (
    <div
      className="shrink-0 w-[168px] rounded-2xl overflow-hidden border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
    >
      <div className="h-28 w-full shimmer" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>
    </div>
  );
}

// Horizontal row of reco skeletons
export function RecoRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-x-hidden -mx-1 px-1">
      {Array.from({ length: count }).map((_, i) => (
        <RecoCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Single order card skeleton
export function OrderCardSkeleton() {
  return (
    <div
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-2 pl-2 border-l-2" style={{ borderColor: "var(--border-color)" }}>
        <Skeleton className="h-3.5 w-48" />
        <Skeleton className="h-3.5 w-40" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// List of order skeletons
export function OrderListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Admin stat card skeleton
export function StatCardSkeleton() {
  return (
    <div
      className="rounded-2xl border p-5 flex items-center gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
    >
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-16" />
      </div>
    </div>
  );
}

// Grid of admin stat skeletons
export function AdminStatGridSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border p-6 space-y-4"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          <Skeleton className="h-6 w-40 mb-2" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-t" style={{ borderColor: "var(--border-color)" }}>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16 ml-auto" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border p-6 space-y-3"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          <Skeleton className="h-6 w-32 mb-2" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "var(--bg-secondary)" }}>
              <Skeleton className="w-7 h-7 rounded-full shrink-0" />
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
