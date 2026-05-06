"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, MeshDistortMaterial, Text } from "@react-three/drei";
import * as THREE from "three";

function AnimatedCardMesh({ color, label, value }: { color: string; label: string; value: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle floating
    meshRef.current.position.y = Math.sin(t * 2) * 0.1;
    // Rotate slightly
    meshRef.current.rotation.y = hovered ? Math.sin(t * 3) * 0.2 : 0;
    meshRef.current.rotation.x = hovered ? Math.cos(t * 3) * 0.2 : 0;
  });

  return (
    <group 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
    >
      <RoundedBox 
        ref={meshRef} 
        args={[2.8, 1.8, 0.4]} 
        radius={0.2} 
        smoothness={4}
      >
        <MeshDistortMaterial
          color={color}
          distort={hovered ? 0.2 : 0}
          speed={hovered ? 5 : 0}
          roughness={0.4}
          metalness={0.6}
          clearcoat={0.8}
        />
      </RoundedBox>
      <Text
        position={[0, 0.2, 0.25]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        {value}
      </Text>
      <Text
        position={[0, -0.4, 0.25]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        {label}
      </Text>
    </group>
  );
}

export function StatCard3D({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="w-full h-48 cursor-pointer">
      <Canvas camera={{ position: [0, 0, 3], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fff" />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color={color} />
        <AnimatedCardMesh color={color} label={label} value={value} />
      </Canvas>
    </div>
  );
}
