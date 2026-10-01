import React from 'react';
import * as THREE from 'three';

export const CyberGround: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Reflective Dark Obsidian Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial
          color="#060204"
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>

      {/* Cyber Highway Grid Lines in Hot Red & Dark Crimson */}
      <gridHelper
        args={[100, 50, '#ff1e42', '#2a0a12']}
        position={[0, 0.01, 0]}
      />

      {/* Road Center Neon Hot Red Guide Track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[0.12, 80]} />
        <meshStandardMaterial
          color="#ff1e42"
          emissive="#ff1e42"
          emissiveIntensity={3.5}
        />
      </mesh>

      {/* Depot Charging Bay Hexagonal Ring Under Vehicle */}
      <group position={[0, 0.03, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.58, 6]} />
          <meshStandardMaterial color="#ff1e42" emissive="#ff1e42" emissiveIntensity={4.0} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.2, 3.25, 32]} />
          <meshStandardMaterial color="#ff6b2b" emissive="#ff6b2b" emissiveIntensity={2.5} />
        </mesh>
      </group>
    </group>
  );
};
