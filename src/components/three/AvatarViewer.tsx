// src/components/three/AvatarViewer.tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function AvatarSphere({ imageUrl }: { imageUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load texture từ avatar URL
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.01;
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <meshStandardMaterial map={texture} roughness={0.1} metalness={0.5} />
    </Sphere>
  );
}

export function AvatarViewer({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <AvatarSphere imageUrl={imageUrl} />
      </Canvas>
    </div>
  );
}
