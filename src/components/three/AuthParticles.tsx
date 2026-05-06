"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ── Single floating particle for auth bg ─────────────────────────────────────
function AuthParticleField({ count = 80, color = "#f97316" }: { count?: number; color?: string }) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * viewport.width * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      sz[i] = 0.02 + Math.random() * 0.08;
    }
    return [pos, sz];
  }, [count, viewport]);

  // Store per-particle phase offsets for wave motion
  const phases = useMemo(
    () => Array.from({ length: count }, () => Math.random() * Math.PI * 2),
    [count]
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const posArr = ref.current.geometry.attributes["position"]?.array as Float32Array | undefined;
    if (!posArr) return;
    for (let i = 0; i < count; i++) {
      const phase = phases[i] ?? 0;
      posArr[i * 3 + 1] = (posArr[i * 3 + 1] ?? 0) + Math.sin(t * 0.5 + phase) * 0.002;
      posArr[i * 3]     = (posArr[i * 3] ?? 0) + Math.cos(t * 0.3 + phase) * 0.001;
    }
    ref.current.geometry.attributes["position"]!.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} sizes={sizes} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
        vertexColors={false}
      />
    </Points>
  );
}

// ── Second layer — pink particles ─────────────────────────────────────────────
function PinkDust({ count = 50 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * viewport.width * 1.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1;
    }
    return pos;
  }, [count, viewport]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = clock.getElapsedTime() * 0.03;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ec4899"
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

// ── Public component ──────────────────────────────────────────────────────────
export function AuthParticles() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: false, alpha: true }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <AuthParticleField count={80} color="#f97316" />
      <PinkDust count={45} />
    </Canvas>
  );
}
