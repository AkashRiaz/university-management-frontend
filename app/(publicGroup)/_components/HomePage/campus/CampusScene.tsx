"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FloatingOrb({
  position,
  color,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;

    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.25;

    ref.current.rotation.x += 0.002;
    ref.current.rotation.y += 0.003;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 2]} />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.25}
          metalness={0.2}
          transparent
          opacity={0.55}
        />
      </mesh>
    </Float>
  );
}

function Ring({
  position,
  scale,
  rotation,
}: {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;

    ref.current.rotation.z += delta * 0.08;
  });

  return (
    <mesh ref={ref} position={position} scale={scale} rotation={rotation}>
      <torusGeometry args={[1, 0.008, 8, 150]} />

      <meshBasicMaterial color="#38bdf8" transparent opacity={0.22} />
    </mesh>
  );
}

function SceneContent() {
  return (
    <group position={[1.7, 0, 0]}>
      <FloatingOrb
        position={[0, 0, -1]}
        color="#0ea5e9"
        scale={1.25}
        speed={0.8}
      />

      <FloatingOrb
        position={[-2.4, 1.1, -0.5]}
        color="#8b5cf6"
        scale={0.4}
        speed={1.1}
      />

      <FloatingOrb
        position={[2.5, -1.2, -0.3]}
        color="#22d3ee"
        scale={0.32}
        speed={1.3}
      />

      <FloatingOrb
        position={[2.1, 1.8, -1]}
        color="#6366f1"
        scale={0.25}
        speed={0.9}
      />

      <Ring position={[0, 0, 0]} scale={2.3} rotation={[1, 0.4, 0.2]} />

      <Ring position={[0, 0, 0]} scale={3} rotation={[0.4, 0.8, 1.2]} />

      <Sparkles
        count={80}
        scale={[8, 6, 4]}
        size={1.5}
        speed={0.3}
        opacity={0.55}
        color="#38bdf8"
      />
    </group>
  );
}

export default function CampusScene() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 8],
        fov: 45,
      }}
      dpr={[1, 1.5]}
      gl={{
        alpha: true,
        antialias: true,
      }}
    >
      <ambientLight intensity={0.5} />

      <pointLight position={[3, 3, 4]} intensity={10} color="#0ea5e9" />

      <pointLight position={[-3, -2, 3]} intensity={8} color="#8b5cf6" />

      <SceneContent />
    </Canvas>
  );
}
