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

/**
 * Lazy-loaded Onboarding Scene.
 */
const OnboardingImpl = dynamic(
  () =>
    import("./OnboardingScene").then((m) => ({ default: m.OnboardingScene })),
  { ssr: false, loading: () => null }
);

export function LazyOnboardingScene(props: { step: number }) {
  return (
    <Suspense fallback={null}>
      <OnboardingImpl {...props} />
    </Suspense>
  );
}

/**
 * Lazy-loaded Particle Burst.
 */
const ParticleBurstImpl = dynamic(
  () =>
    import("./ParticleBurst").then((m) => ({ default: m.ParticleBurst })),
  { ssr: false, loading: () => null }
);

export function LazyParticleBurst() {
  return (
    <Suspense fallback={null}>
      <ParticleBurstImpl />
    </Suspense>
  );
}

/**
 * Lazy-loaded Avatar Viewer.
 */
const AvatarImpl = dynamic(
  () =>
    import("./AvatarViewer").then((m) => ({ default: m.AvatarViewer })),
  { ssr: false, loading: () => null }
);

export function LazyAvatarViewer(props: { imageUrl: string }) {
  return (
    <Suspense fallback={null}>
      <AvatarImpl {...props} />
    </Suspense>
  );
}

/**
 * Lazy-loaded Glitch Scene.
 */
const GlitchImpl = dynamic(
  () =>
    import("./GlitchScene").then((m) => ({ default: m.GlitchScene })),
  { ssr: false, loading: () => null }
);

export function LazyGlitchScene(props: { text: string }) {
  return (
    <Suspense fallback={null}>
      <GlitchImpl {...props} />
    </Suspense>
  );
}

/**
 * Lazy-loaded Loader Scene.
 */
const LoaderImpl = dynamic(
  () =>
    import("./LoaderScene").then((m) => ({ default: m.LoaderScene })),
  { ssr: false, loading: () => null }
);

export function LazyLoaderScene() {
  return (
    <Suspense fallback={null}>
      <LoaderImpl />
    </Suspense>
  );
}
