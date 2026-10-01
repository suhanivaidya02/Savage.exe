import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EvSedanProps {
  scrollProgress: number;
  stationColor?: string;
}

export const EvSedan: React.FC<EvSedanProps> = ({ scrollProgress, stationColor = '#00e5ff' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Subtle natural chassis breathing / suspension bob
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 2) * 0.04;

    // Subtle drift rotation based on scroll progress
    groupRef.current.rotation.y = Math.sin(scrollProgress * Math.PI * 2) * 0.15;

    // Rotate wheels
    wheelsRef.current.forEach((wheel) => {
      if (wheel) {
        wheel.rotation.x += delta * 4;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* ================= MAIN CHASSIS / LOWER BODY ================= */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.45, 4.4]} />
        <meshStandardMaterial
          color="#061224"
          metalness={0.92}
          roughness={0.22}
        />
      </mesh>

      {/* Aerodynamic Front Hood Slope */}
      <mesh position={[0, 0.48, 1.6]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[1.82, 0.28, 1.3]} />
        <meshStandardMaterial color="#08182f" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Aerodynamic Rear Fastback Trunk Deck */}
      <mesh position={[0, 0.52, -1.6]} rotation={[0.12, 0, 0]} castShadow>
        <boxGeometry args={[1.82, 0.28, 1.2]} />
        <meshStandardMaterial color="#08182f" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* ================= AERODYNAMIC CABIN & GLASS CANOPY ================= */}
      <mesh position={[0, 0.95, -0.1]} castShadow>
        <boxGeometry args={[1.5, 0.55, 2.2]} />
        <meshPhysicalMaterial
          color="#001830"
          transmission={0.65}
          opacity={0.85}
          transparent
          roughness={0.1}
          ior={1.5}
        />
      </mesh>

      {/* Cabin Roof Carbon Slat */}
      <mesh position={[0, 1.24, -0.1]}>
        <boxGeometry args={[1.42, 0.05, 2.0]} />
        <meshStandardMaterial color="#020813" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* ================= FRONT CYBER HEADLIGHTS ================= */}
      {/* Central Matrix Lightbar */}
      <mesh position={[0, 0.52, 2.21]}>
        <boxGeometry args={[1.65, 0.08, 0.05]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={3.5}
        />
      </mesh>

      {/* Left Laser Headlight Module */}
      <mesh position={[-0.75, 0.52, 2.18]}>
        <boxGeometry args={[0.25, 0.1, 0.08]} />
        <meshStandardMaterial color="#39ff88" emissive="#39ff88" emissiveIntensity={4.0} />
      </mesh>

      {/* Right Laser Headlight Module */}
      <mesh position={[0.75, 0.52, 2.18]}>
        <boxGeometry args={[0.25, 0.1, 0.08]} />
        <meshStandardMaterial color="#39ff88" emissive="#39ff88" emissiveIntensity={4.0} />
      </mesh>

      {/* Headlight Volumetric Beam Projectors */}
      <spotLight
        position={[-0.6, 0.55, 2.3]}
        target-position={[-0.6, 0, 12]}
        angle={0.45}
        penumbra={0.6}
        intensity={2.8}
        color="#00e5ff"
        castShadow
      />
      <spotLight
        position={[0.6, 0.55, 2.3]}
        target-position={[0.6, 0, 12]}
        angle={0.45}
        penumbra={0.6}
        intensity={2.8}
        color="#00e5ff"
        castShadow
      />

      {/* ================= REAR CRIMSON FULL-WIDTH LIGHTBAR ================= */}
      <mesh position={[0, 0.56, -2.21]}>
        <boxGeometry args={[1.72, 0.07, 0.05]} />
        <meshStandardMaterial
          color="#ff3366"
          emissive="#ff3366"
          emissiveIntensity={4.0}
        />
      </mesh>

      {/* Lower Diffuser Crimson Accents */}
      <mesh position={[-0.65, 0.32, -2.2]}>
        <boxGeometry args={[0.25, 0.04, 0.04]} />
        <meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0.65, 0.32, -2.2]}>
        <boxGeometry args={[0.25, 0.04, 0.04]} />
        <meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={2.5} />
      </mesh>

      {/* ================= SIDE SKIRT CYBER ACCENT STRIPS ================= */}
      <mesh position={[-0.96, 0.32, 0]}>
        <boxGeometry args={[0.04, 0.05, 3.2]} />
        <meshStandardMaterial color={stationColor} emissive={stationColor} emissiveIntensity={2.0} />
      </mesh>
      <mesh position={[0.96, 0.32, 0]}>
        <boxGeometry args={[0.04, 0.05, 3.2]} />
        <meshStandardMaterial color={stationColor} emissive={stationColor} emissiveIntensity={2.0} />
      </mesh>

      {/* ================= 4 AERO WHEEL ASSEMBLIES ================= */}
      {[
        { x: -0.98, y: 0.35, z: 1.35, index: 0 },
        { x: 0.98, y: 0.35, z: 1.35, index: 1 },
        { x: -0.98, y: 0.35, z: -1.35, index: 2 },
        { x: 0.98, y: 0.35, z: -1.35, index: 3 },
      ].map((pos) => (
        <group
          key={pos.index}
          position={[pos.x, pos.y, pos.z]}
          ref={(el) => {
            if (el) wheelsRef.current[pos.index] = el;
          }}
        >
          {/* Tire Ring */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.22, 24]} />
            <meshStandardMaterial color="#080d16" roughness={0.7} />
          </mesh>
          {/* Aero Turbine Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.23, 16]} />
            <meshStandardMaterial color="#1a273b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Glowing Hubcap Center */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[pos.x > 0 ? 0.12 : -0.12, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2.5} />
          </mesh>
        </group>
      ))}

      {/* Underglow Neon Floor Glow */}
      <pointLight
        position={[0, 0.15, 0]}
        distance={3.5}
        intensity={3.0}
        color={stationColor}
      />
    </group>
  );
};
