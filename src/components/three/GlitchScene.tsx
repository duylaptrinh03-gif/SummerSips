// src/components/three/GlitchScene.tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";

function GlitchText({ text }: { text: string }) {
  const textRef = useRef<any>(null);

  useFrame((state) => {
    if (!textRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Ngẫu nhiên glitch vị trí và scale
    if (Math.random() > 0.95) {
      textRef.current.position.x = Math.random() * 0.1;
      textRef.current.scale.setScalar(1 + Math.random() * 0.05);
    } else {
      textRef.current.position.x = 0;
      textRef.current.scale.setScalar(1);
    }

    textRef.current.rotation.y = Math.sin(t) * 0.1;
  });

  return (
    <Text
      ref={textRef}
      fontSize={2}
      color="#ec4899"
      font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.ttf"
    >
      {text}
      <meshStandardMaterial emissive="#f97316" emissiveIntensity={2} />
    </Text>
  );
}

export function GlitchScene({ text }: { text: string }) {
  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={5} rotationIntensity={2} floatIntensity={2}>
          <GlitchText text={text} />
        </Float>
      </Canvas>
    </div>
  );
}
