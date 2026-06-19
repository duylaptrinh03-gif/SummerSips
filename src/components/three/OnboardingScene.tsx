// src/components/three/OnboardingScene.tsx
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function AnimatedShape({ step }: { step: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Tính toán màu sắc dựa trên step
  const colors = ["#f97316", "#ec4899", "#8b5cf6", "#10b981"];
  const color = useMemo(() => new THREE.Color(colors[step] || colors[0]), [step]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Xoay nhẹ shape
    meshRef.current.rotation.x = Math.cos(t / 4) / 4;
    meshRef.current.rotation.y = Math.sin(t / 4) / 4;
    
    // Smooth color transition
    (meshRef.current.material as THREE.MeshStandardMaterial).color.lerp(color, 0.05);
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          distort={0.4}
          speed={3}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export function OnboardingScene({ step }: { step: number }) {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="white" intensity={0.5} />
        
        <AnimatedShape step={step} />
      </Canvas>
    </div>
  );
}
