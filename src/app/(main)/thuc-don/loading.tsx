import { ProductGridSkeleton } from "@/components/ui/Skeleton";

/**
 * Loading skeleton cho trang Thực Đơn.
 * Next.js tự động wrap page này trong <Suspense> khi navigate.
 */
export default function Loading() {
  return (
    <div className="min-h-screen pb-40" style={{ background: "var(--bg-secondary)" }}>
      {/* Header banner skeleton */}
      <section className="py-16 px-4 text-center" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-3xl mx-auto space-y-4">
          <div
            className="shimmer h-7 w-48 rounded-full mx-auto"
          />
          <div className="shimmer h-12 w-3/4 rounded-2xl mx-auto" />
          <div className="shimmer h-5 w-1/2 rounded-xl mx-auto" />
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="shimmer h-4 w-24 rounded mb-6" />
        <ProductGridSkeleton count={8} />
      </main>
    </div>
  );
}
