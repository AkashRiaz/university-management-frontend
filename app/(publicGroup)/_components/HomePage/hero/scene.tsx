"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sparkles,
} from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AcademicCore() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    group.current.rotation.y += delta * 0.09;

    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
  });

  return (
    <group ref={group}>
      {/* main central object */}
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.45, 4]} />

          <MeshDistortMaterial
            color="#6366f1"
            roughness={0.18}
            metalness={0.25}
            distort={0.28}
            speed={1.8}
            transparent
            opacity={0.78}
          />
        </mesh>

        {/* inner sphere */}
        <mesh scale={0.7}>
          <sphereGeometry args={[1, 40, 40]} />

          <meshStandardMaterial
            color="#2563eb"
            emissive="#4f46e5"
            emissiveIntensity={0.7}
            roughness={0.25}
          />
        </mesh>
      </Float>

      <OrbitingNode
        position={[2.35, 0.6, 0]}
        size={0.2}
        speed={0.5}
        offset={0}
      />

      <OrbitingNode
        position={[-2.2, -0.8, 0.3]}
        size={0.15}
        speed={0.7}
        offset={2}
      />

      <OrbitingNode
        position={[0.4, 2.1, -0.6]}
        size={0.12}
        speed={0.6}
        offset={4}
      />

      <OrbitRing scale={2.3} rotation={[1.15, 0.4, 0]} />
      <OrbitRing scale={2.8} rotation={[0.45, 0.2, 1.2]} />
      <OrbitRing scale={3.4} rotation={[1.7, 0.6, 0.5]} />
    </group>
  );
}

function OrbitRing({
  scale,
  rotation,
}: {
  scale: number;
  rotation: [number, number, number];
}) {
  return (
    <mesh scale={scale} rotation={rotation}>
      <torusGeometry args={[1, 0.0035, 8, 180]} />

      <meshBasicMaterial color="#818cf8" transparent opacity={0.22} />
    </mesh>
  );
}

function OrbitingNode({
  position,
  size,
  speed,
  offset,
}: {
  position: [number, number, number];
  size: number;
  speed: number;
  offset: number;
}) {
  const node = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!node.current) return;

    const t = state.clock.elapsedTime * speed + offset;

    node.current.position.x = Math.cos(t) * Math.abs(position[0]);

    node.current.position.z = Math.sin(t) * 1.3;

    node.current.position.y = position[1] + Math.sin(t * 1.3) * 0.35;
  });

  return (
    <mesh ref={node}>
      <sphereGeometry args={[size, 24, 24]} />

      <meshStandardMaterial
        color="#a78bfa"
        emissive="#7c3aed"
        emissiveIntensity={2}
      />
    </mesh>
  );
}

function FloatingBook({
  position,
  rotation,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  return (
    <Float speed={1.3} rotationIntensity={0.35} floatIntensity={0.6}>
      <group position={position} rotation={rotation} scale={scale}>
        <mesh>
          <boxGeometry args={[1.1, 0.12, 0.75]} />

          <meshStandardMaterial
            color="#1d4ed8"
            roughness={0.32}
            metalness={0.15}
          />
        </mesh>

        <mesh position={[0, 0.085, 0]}>
          <boxGeometry args={[1, 0.045, 0.67]} />

          <meshStandardMaterial color="#dbeafe" roughness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

function GraduationCap({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.7}>
      <group position={position} rotation={[0.2, -0.6, -0.1]} scale={0.9}>
        {/* cap board */}
        <mesh rotation={[0, 0.3, 0]}>
          <boxGeometry args={[1.35, 0.08, 1.35]} />

          <meshStandardMaterial
            color="#111827"
            roughness={0.25}
            metalness={0.25}
          />
        </mesh>

        {/* cap base */}
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.47, 0.57, 0.38, 4]} />

          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>

        {/* center */}
        <mesh position={[0, 0.07, 0]}>
          <sphereGeometry args={[0.07, 20, 20]} />

          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#7c3aed"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 8],
        fov: 42,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <ambientLight intensity={0.55} />

      <directionalLight position={[4, 5, 5]} intensity={2.3} color="#dbeafe" />

      <pointLight
        position={[2, 1, 3]}
        intensity={12}
        color="#6366f1"
        distance={10}
      />

      <pointLight
        position={[-4, -2, 1]}
        intensity={8}
        color="#8b5cf6"
        distance={9}
      />

      <group position={[2.3, 0, 0]} rotation={[0.05, -0.15, 0]}>
        <AcademicCore />

        <GraduationCap position={[0.5, 2.35, 0.5]} />

        <FloatingBook
          position={[-2.5, 1.25, -0.5]}
          rotation={[0.3, 0.5, 0.2]}
          scale={0.65}
        />

        <FloatingBook
          position={[2.45, -1.65, -0.3]}
          rotation={[-0.2, -0.4, 0.2]}
          scale={0.52}
        />

        <Sparkles
          count={65}
          scale={[7, 6, 5]}
          size={1.6}
          speed={0.25}
          opacity={0.55}
          color="#818cf8"
        />
      </group>
    </Canvas>
  );
}
