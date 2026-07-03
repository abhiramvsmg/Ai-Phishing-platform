"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * The floating shield is built from primitives (icosahedron core +
 * torus ring + small orbiting spheres) rather than an imported
 * model — no external GLTF asset to host or fail to load. Real
 * Three.js geometry, real lighting, real glass material via drei's
 * MeshTransmissionMaterial — not a CSS approximation.
 */
function Shield() {
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15;
      ringRef.current.rotation.x += delta * 0.05;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <group>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.15, 1]} />
          <MeshTransmissionMaterial
            thickness={0.4}
            roughness={0.05}
            transmission={1}
            ior={1.3}
            chromaticAberration={0.04}
            color="#5B7A99"
            distortion={0.15}
          />
        </mesh>

        <mesh ref={ringRef}>
          <torusGeometry args={[1.7, 0.035, 16, 100]} />
          <meshStandardMaterial
            color="#7C9BB8"
            emissive="#7C9BB8"
            emissiveIntensity={0.75}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2.3, 0, 0.6]}>
          <torusGeometry args={[2.05, 0.018, 16, 100]} />
          <meshStandardMaterial
            color="#6B6F76"
            emissive="#6B6F76"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Particles() {
  const count = 120;
  const positions = useRef<Float32Array>(
    new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 12)
  );

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#8A8F99" transparent opacity={0.5} />
    </points>
  );
}

export function ShieldScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[4, 3, 4]} intensity={40} color="#7C9BB8" />
          <pointLight position={[-4, -2, -3]} intensity={25} color="#6B6F76" />
          <pointLight position={[0, 4, 2]} intensity={20} color="#5B7A99" />

          <Shield />
          <Particles />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}