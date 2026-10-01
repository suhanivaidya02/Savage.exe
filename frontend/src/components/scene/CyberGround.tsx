import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CyberGround: React.FC = () => {
  const outerRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.15;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.25;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Reflective Dark Mirror Obsidian Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial
          color="#070204"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>

      {/* Primary Cyber Highway Grid in Hot Red & Deep Crimson */}
      <gridHelper
        args={[120, 60, '#ff1e42', '#1a050b']}
        position={[0, 0.01, 0]}
      />

      {/* Central Illuminated Highway Energy Strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[0.2, 100]} />
        <meshStandardMaterial
          color="#ff1e42"
          emissive="#ff1e42"
          emissiveIntensity={4.0}
        />
      </mesh>

      {/* Flanking Amber Energy Guidance Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.5, 0.02, 0]}>
        <planeGeometry args={[0.08, 100]} />
        <meshStandardMaterial
          color="#ff6b2b"
          emissive="#ff6b2b"
          emissiveIntensity={2.5}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.5, 0.02, 0]}>
        <planeGeometry args={[0.08, 100]} />
        <meshStandardMaterial
          color="#ff6b2b"
          emissive="#ff6b2b"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* ================= HOLOGRAPHIC CHARGING PEDESTAL ================= */}
      <group position={[0, 0.03, 0]}>
        {/* Solid Circular Charging Platform Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.8, 48]} />
          <meshStandardMaterial
            color="#120409"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Outer Rotating Cyber Hexagonal Ring */}
        <group ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[3.6, 3.75, 6]} />
            <meshStandardMaterial
              color="#ff1e42"
              emissive="#ff1e42"
              emissiveIntensity={4.0}
            />
          </mesh>
        </group>

        {/* Inner Pulsing Precision Ring */}
        <group ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[2.8, 2.88, 32]} />
            <meshStandardMaterial
              color="#ff6b2b"
              emissive="#ff6b2b"
              emissiveIntensity={3.5}
            />
          </mesh>
        </group>

        {/* Central Vehicle Alignment Target Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.56, 32]} />
          <meshStandardMaterial
            color="#ff1e42"
            emissive="#ff1e42"
            emissiveIntensity={3.0}
          />
        </mesh>

        {/* Radial Docking Energy Spokes */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={i}
              rotation={[-Math.PI / 2, 0, rad]}
              position={[0, 0.005, 0]}
            >
              <planeGeometry args={[0.06, 3.4]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#ff1e42' : '#ff6b2b'}
                emissive={i % 2 === 0 ? '#ff1e42' : '#ff6b2b'}
                emissiveIntensity={2.5}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
