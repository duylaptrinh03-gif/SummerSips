"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

/**
 * Lazy-loaded Three.js Hero particles.
 * Rendered ssr:false so WebGL only boots on client.
 * Falls back to null if WebGL unavailable (Canvas handles gracefully).
 */
const HeroParticlesImpl = dynamic(
  () =>
    import("./HeroParticles").then((m) => ({ default: m.HeroParticles })),
  { ssr: false, loading: () => null }
);

export function LazyHeroParticles(props: React.ComponentProps<typeof HeroParticlesImpl>) {
  return (
    <Suspense fallback={null}>
      <HeroParticlesImpl {...props} />
    </Suspense>
  );
}

/**
 * Lazy-loaded Auth background particles.
 */
const AuthParticlesImpl = dynamic(
  () =>
    import("./AuthParticles").then((m) => ({ default: m.AuthParticles })),
  { ssr: false, loading: () => null }
);

export function LazyAuthParticles() {
  return (
    <Suspense fallback={null}>
      <AuthParticlesImpl />
    </Suspense>
  );
}

/**
 * Lazy-loaded Search Orb.
 */
const SearchOrbImpl = dynamic(
  () =>
    import("./SearchOrb").then((m) => ({ default: m.SearchOrb })),
  { ssr: false, loading: () => null }
);

export function LazySearchOrb(props: React.ComponentProps<typeof SearchOrbImpl>) {
  return (
    <Suspense fallback={null}>
      <SearchOrbImpl {...props} />
    </Suspense>
  );
}

/**
 * Lazy-loaded Stat Card 3D.
 */
const StatCardImpl = dynamic(
  () =>
    import("./StatCard").then((m) => ({ default: m.StatCard3D })),
  { ssr: false, loading: () => null }
);

export function LazyStatCard(props: React.ComponentProps<typeof StatCardImpl>) {
  return (
    <Suspense fallback={null}>
      <StatCardImpl {...props} />
    </Suspense>
  );
}
