/**
 * Loading skeleton cho trang Giỏ Hàng.
 */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="shimmer h-9 w-36 rounded-xl" />
            <div className="shimmer h-4 w-24 rounded" />
          </div>
          <div className="shimmer h-5 w-20 rounded" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items skeleton */}
          <div className="flex-1 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border p-4 flex gap-4"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
              >
                <div className="shimmer w-20 h-20 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="shimmer h-5 w-3/4 rounded" />
                  <div className="shimmer h-4 w-1/2 rounded" />
                  <div className="shimmer h-4 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar skeleton */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div
              className="rounded-3xl p-8 border space-y-4"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
            >
              <div className="shimmer h-7 w-36 rounded-xl" />
              <div className="space-y-3">
                <div className="shimmer h-4 w-full rounded" />
                <div className="shimmer h-4 w-full rounded" />
                <div className="shimmer h-4 w-2/3 rounded" />
              </div>
              <div className="shimmer h-12 w-full rounded-2xl mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
