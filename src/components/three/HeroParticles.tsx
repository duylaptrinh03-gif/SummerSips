"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ── Floating particle cloud ──────────────────────────────────────────────────
function ParticleCloud({
  count = 1200,
  color = "#f97316",
}: {
  count?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Points>(null);
  const { size } = useThree();

  // Generate positions once
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const radius = Math.min(size.width, size.height) * 0.004;
    for (let i = 0; i < count; i++) {
      const r = radius * (0.3 + Math.random() * 0.7);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, size]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.08;
    ref.current.rotation.y = t;
    ref.current.rotation.x = t * 0.4;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.012}
        sizeAttenuation
        depthWrite={false}
        opacity={0.75}
      />
    </Points>
  );
}

// ── Inner ring (second slower layer) ─────────────────────────────────────────
function RingCloud({ count = 600, color = "#ec4899" }: { count?: number; color?: string }) {
  const ref = useRef<THREE.Points>(null);
  const { size } = useThree();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const radius = Math.min(size.width, size.height) * 0.0025;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = radius * (0.5 + Math.random() * 0.5);
      arr[i * 3] = r * Math.cos(theta);
      arr[i * 3 + 1] = (Math.random() - 0.5) * radius * 0.5;
      arr[i * 3 + 2] = r * Math.sin(theta);
    }
    return arr;
  }, [count, size]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.05;
    ref.current.rotation.y = -t;
    ref.current.rotation.z = t * 0.3;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

interface HeroParticlesProps {
  /** Primary color (orange brand) */
  primaryColor?: string;
  /** Secondary color (pink brand) */
  secondaryColor?: string;
}

export function HeroParticles({
  primaryColor = "#f97316",
  secondaryColor = "#ec4899",
}: HeroParticlesProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1.5], fov: 75 }}
      gl={{ antialias: false, alpha: true }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <ParticleCloud count={1200} color={primaryColor} />
      <RingCloud count={500} color={secondaryColor} />
    </Canvas>
  );
}
