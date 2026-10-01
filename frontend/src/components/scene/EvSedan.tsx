import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EvSedanProps {
  scrollProgress: number;
  stationColor?: string;
}

export const EvSedan: React.FC<EvSedanProps> = ({ scrollProgress, stationColor = '#ff1e42' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const chargeRingRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    // Gentle suspension breathing motion
    groupRef.current.position.y = Math.sin(t * 1.8) * 0.03;

    // Smooth rotational showcase drift across scroll chapters
    groupRef.current.rotation.y = Math.sin(scrollProgress * Math.PI * 2) * 0.22;

    // Rotate aerodynamic turbine wheels
    wheelsRef.current.forEach((wheel) => {
      if (wheel) {
        wheel.rotation.x += delta * 3.5;
      }
    });

    // Pulsing charging energy ring
    if (chargeRingRef.current) {
      chargeRingRef.current.rotation.z += delta * 1.5;
      const s = 1.0 + Math.sin(t * 4) * 0.08;
      chargeRingRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.05, 0]} scale={[1.15, 1.15, 1.15]}>
      {/* ================= LOWER SPORTS CHASSIS (Deep Crimson & Metallic Obsidian) ================= */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[1.98, 0.38, 4.4]} />
        <meshStandardMaterial
          color="#160307"
          metalness={0.92}
          roughness={0.16}
        />
      </mesh>

      {/* Aerodynamic Front Hood Wedge */}
      <mesh position={[0, 0.44, 1.62]} rotation={[-0.14, 0, 0]}>
        <boxGeometry args={[1.9, 0.24, 1.3]} />
        <meshStandardMaterial
          color="#22050b"
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>

      {/* Aerodynamic Rear Fastback Deck */}
      <mesh position={[0, 0.48, -1.62]} rotation={[0.11, 0, 0]}>
        <boxGeometry args={[1.9, 0.24, 1.2]} />
        <meshStandardMaterial
          color="#22050b"
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>

      {/* Front Carbon Fiber Splitter & Winglets */}
      <mesh position={[0, 0.24, 2.24]}>
        <boxGeometry args={[1.96, 0.06, 0.2]} />
        <meshStandardMaterial color="#0a0305" metalness={0.95} roughness={0.3} />
      </mesh>
      {/* Splitter Red Edge Accent */}
      <mesh position={[0, 0.25, 2.34]}>
        <boxGeometry args={[1.92, 0.02, 0.04]} />
        <meshStandardMaterial color="#ff1e42" emissive="#ff1e42" emissiveIntensity={3.5} />
      </mesh>

      {/* ================= AERODYNAMIC SMOKED COCKPIT CANOPY ================= */}
      <mesh position={[0, 0.88, -0.1]}>
        <boxGeometry args={[1.52, 0.52, 2.24]} />
        <meshStandardMaterial
          color="#0c0205"
          opacity={0.88}
          transparent
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Carbon Roof Panel */}
      <mesh position={[0, 1.15, -0.1]}>
        <boxGeometry args={[1.44, 0.04, 2.0]} />
        <meshStandardMaterial color="#080204" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Cockpit Internal Red HUD Ambient Glow */}
      <mesh position={[0, 0.78, 0.35]}>
        <boxGeometry args={[0.9, 0.04, 0.3]} />
        <meshStandardMaterial color="#ff1e42" emissive="#ff1e42" emissiveIntensity={2.5} />
      </mesh>

      {/* ================= FRONT LASER MATRIX HEADLIGHTS ================= */}
      {/* Full-width Razor Horizon Lightbar */}
      <mesh position={[0, 0.48, 2.22]}>
        <boxGeometry args={[1.74, 0.06, 0.04]} />
        <meshStandardMaterial
          color="#ff1e42"
          emissive="#ff1e42"
          emissiveIntensity={5.0}
        />
      </mesh>

      {/* Left Quad-LED Projector */}
      <mesh position={[-0.75, 0.48, 2.2]}>
        <boxGeometry args={[0.22, 0.08, 0.06]} />
        <meshStandardMaterial color="#ffffff" emissive="#ff3366" emissiveIntensity={4.0} />
      </mesh>

      {/* Right Quad-LED Projector */}
      <mesh position={[0.75, 0.48, 2.2]}>
        <boxGeometry args={[0.22, 0.08, 0.06]} />
        <meshStandardMaterial color="#ffffff" emissive="#ff3366" emissiveIntensity={4.0} />
      </mesh>

      {/* ================= REAR CYBER LIGHTBAR & DIFFUSER ================= */}
      <mesh position={[0, 0.52, -2.22]}>
        <boxGeometry args={[1.78, 0.07, 0.04]} />
        <meshStandardMaterial
          color="#ff0033"
          emissive="#ff0033"
          emissiveIntensity={5.0}
        />
      </mesh>

      {/* Lower Rear Carbon Diffuser with Aero Fins */}
      <mesh position={[0, 0.25, -2.18]}>
        <boxGeometry args={[1.8, 0.1, 0.15]} />
        <meshStandardMaterial color="#0a0204" metalness={0.95} roughness={0.3} />
      </mesh>
      <mesh position={[-0.6, 0.25, -2.25]}>
        <boxGeometry args={[0.04, 0.12, 0.2]} />
        <meshStandardMaterial color="#ff1e42" emissive="#ff1e42" emissiveIntensity={3.0} />
      </mesh>
      <mesh position={[0.6, 0.25, -2.25]}>
        <boxGeometry args={[0.04, 0.12, 0.2]} />
        <meshStandardMaterial color="#ff1e42" emissive="#ff1e42" emissiveIntensity={3.0} />
      </mesh>

      {/* ================= SIDE SKIRT ILLUMINATED CONDUITS ================= */}
      <mesh position={[-1.0, 0.28, 0]}>
        <boxGeometry args={[0.04, 0.04, 3.2]} />
        <meshStandardMaterial color={stationColor} emissive={stationColor} emissiveIntensity={3.0} />
      </mesh>
      <mesh position={[1.0, 0.28, 0]}>
        <boxGeometry args={[0.04, 0.04, 3.2]} />
        <meshStandardMaterial color={stationColor} emissive={stationColor} emissiveIntensity={3.0} />
      </mesh>

      {/* ================= HOLOGRAPHIC CHARGE PORT COUPLER ================= */}
      {/* Active Port on Front Left Fender */}
      <group position={[-1.02, 0.55, 1.1]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
          <meshStandardMaterial color={stationColor} emissive={stationColor} emissiveIntensity={4.0} />
        </mesh>
        {/* Pulsing Holographic Ring */}
        <mesh ref={chargeRingRef} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.18, 0.24, 16]} />
          <meshStandardMaterial color={stationColor} emissive={stationColor} emissiveIntensity={4.5} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ================= 4 AERO TURBINE WHEEL ASSEMBLIES ================= */}
      {[
        { x: -1.0, y: 0.34, z: 1.35, index: 0 },
        { x: 1.0, y: 0.34, z: 1.35, index: 1 },
        { x: -1.0, y: 0.34, z: -1.35, index: 2 },
        { x: 1.0, y: 0.34, z: -1.35, index: 3 },
      ].map((pos) => (
        <group
          key={pos.index}
          position={[pos.x, pos.y, pos.z]}
          ref={(el) => {
            if (el) wheelsRef.current[pos.index] = el;
          }}
        >
          {/* Performance Low-Profile Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.35, 0.35, 0.22, 18]} />
            <meshStandardMaterial color="#0c0608" roughness={0.8} />
          </mesh>
          {/* Aero Turbine Rim Face */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.27, 0.27, 0.23, 14]} />
            <meshStandardMaterial color="#26080e" metalness={0.92} roughness={0.2} />
          </mesh>
          {/* Glowing Center Core */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[pos.x > 0 ? 0.12 : -0.12, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 10]} />
            <meshStandardMaterial color="#ff1e42" emissive="#ff1e42" emissiveIntensity={3.5} />
          </mesh>
        </group>
      ))}

      {/* Dynamic Underglow Ground Spotlight (Matches active selected charging station) */}
      <pointLight
        position={[0, 0.12, 0]}
        distance={4.5}
        intensity={3.8}
        color={stationColor}
      />
    </group>
  );
};
