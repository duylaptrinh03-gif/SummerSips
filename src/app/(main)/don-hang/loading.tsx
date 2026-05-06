/**
 * Loading skeleton cho trang Đơn Hàng.
 * Next.js tự động wrap page này trong <Suspense> khi navigate.
 */
export default function Loading() {
  return (
    <div className="min-h-screen py-10" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header skeleton */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="shimmer h-9 w-56 rounded-xl" />
            <div className="shimmer h-4 w-40 rounded" />
          </div>
          <div className="shimmer h-5 w-24 rounded" />
        </div>

        {/* Order card skeletons */}
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden border"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
            >
              {/* Card header */}
              <div
                className="flex justify-between items-center px-5 py-4 border-b"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
              >
                <div className="space-y-2">
                  <div className="shimmer h-4 w-32 rounded" />
                  <div className="shimmer h-3 w-24 rounded" />
                </div>
                <div className="shimmer h-6 w-28 rounded-xl" />
              </div>

              {/* Card body */}
              <div className="px-5 py-5 space-y-3">
                <div className="shimmer h-4 w-48 rounded" />
                <div className="shimmer h-4 w-64 rounded" />
                <div className="shimmer h-4 w-40 rounded" />
              </div>

              {/* Card footer */}
              <div
                className="px-5 py-4 border-t"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
              >
                <div className="shimmer h-7 w-32 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
