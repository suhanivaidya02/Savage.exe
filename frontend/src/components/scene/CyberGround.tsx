import React from 'react';
import * as THREE from 'three';

export const CyberGround: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Reflective Dark Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial
          color="#030712"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Cyber Highway Grid Lines */}
      <gridHelper
        args={[100, 50, '#00e5ff', '#0d2238']}
        position={[0, 0.01, 0]}
      />

      {/* Road Center Neon Guide Track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[0.1, 80]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={3.0}
        />
      </mesh>

      {/* Depot Charging Bay Hexagonal Ring Under Vehicle */}
      <group position={[0, 0.03, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.58, 6]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3.5} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.2, 3.25, 32]} />
          <meshStandardMaterial color="#39ff88" emissive="#39ff88" emissiveIntensity={2.0} />
        </mesh>
      </group>
    </group>
  );
};
