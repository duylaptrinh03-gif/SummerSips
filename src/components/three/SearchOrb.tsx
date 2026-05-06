"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function OrbMesh({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={isHovered ? 1.1 : 1}>
      <MeshDistortMaterial
        color="#f97316"
        attach="material"
        distort={isHovered ? 0.6 : 0.4}
        speed={isHovered ? 4 : 2}
        roughness={0.2}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </Sphere>
  );
}

export function SearchOrb({ isHovered = false }: { isHovered?: boolean }) {
  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 2.5] }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#fff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ec4899" />
        <OrbMesh isHovered={isHovered} />
      </Canvas>
    </div>
  );
}
