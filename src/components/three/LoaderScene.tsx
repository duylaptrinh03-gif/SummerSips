// src/components/three/LoaderScene.tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { TorusKnot, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function LoadingKnot() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t;
    ref.current.rotation.y = t * 1.5;
  });

  return (
    <TorusKnot ref={ref} args={[1, 0.3, 128, 32]}>
      <meshStandardMaterial
        color="#f97316"
        roughness={0.1}
        metalness={1}
        emissive="#ec4899"
        emissiveIntensity={0.5}
      />
    </TorusKnot>
  );
}

export function LoaderScene() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <LoadingKnot />
      </Canvas>
    </div>
  );
}
