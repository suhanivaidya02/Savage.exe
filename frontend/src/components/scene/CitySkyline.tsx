import React, { useMemo } from 'react';
import * as THREE from 'three';

export const CitySkyline: React.FC = () => {
  const { buildingData } = useMemo(() => {
    const buildings: { position: [number, number, number]; scale: [number, number, number] }[] = [];
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    let seed = 42;
    // Left cityscape cluster
    for (let x = -28; x <= -8; x += 3.5) {
      for (let z = -20; z <= 25; z += 4.5) {
        const height = 4 + seedRandom(seed++) * 14;
        const width = 2.2 + seedRandom(seed++) * 1.5;
        const depth = 2.2 + seedRandom(seed++) * 1.8;
        buildings.push({
          position: [x, height / 2 - 0.5, z],
          scale: [width, height, depth],
        });
      }
    }

    // Right cityscape cluster
    for (let x = 8; x <= 28; x += 3.5) {
      for (let z = -20; z <= 25; z += 4.5) {
        const height = 4 + seedRandom(seed++) * 14;
        const width = 2.2 + seedRandom(seed++) * 1.5;
        const depth = 2.2 + seedRandom(seed++) * 1.8;
        buildings.push({
          position: [x, height / 2 - 0.5, z],
          scale: [width, height, depth],
        });
      }
    }

    return { buildingData: buildings };
  }, []);

  return (
    <group>
      {buildingData.map((b, i) => (
        <group key={i} position={b.position}>
          {/* Main Dark Obsidian Shell */}
          <mesh scale={b.scale} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#0d0407"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>

          {/* Roof Edge Glowing Hot Red Beacon */}
          {i % 3 === 0 && (
            <mesh position={[0, b.scale[1] / 2 + 0.1, 0]}>
              <boxGeometry args={[b.scale[0] * 0.95, 0.12, b.scale[2] * 0.95]} />
              <meshStandardMaterial
                color="#ff1e42"
                emissive="#ff1e42"
                emissiveIntensity={2.5}
              />
            </mesh>
          )}

          {/* Emissive Vertical Window Ribbons */}
          {i % 2 === 0 && (
            <mesh position={[0, 0, b.scale[2] / 2 + 0.02]}>
              <planeGeometry args={[0.25, b.scale[1] * 0.8]} />
              <meshStandardMaterial
                color={i % 4 === 0 ? '#ff6b2b' : '#ff1e42'}
                emissive={i % 4 === 0 ? '#ff6b2b' : '#ff1e42'}
                emissiveIntensity={2.2}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Distant Depot S1/S2/S3 Communication Monoliths */}
      <group position={[-14, 10, -22]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.4, 18, 8]} />
          <meshStandardMaterial color="#ff1e42" emissive="#ff1e42" emissiveIntensity={3.5} />
        </mesh>
        <pointLight distance={12} intensity={4} color="#ff1e42" />
      </group>

      <group position={[14, 10, -22]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.4, 18, 8]} />
          <meshStandardMaterial color="#ff6b2b" emissive="#ff6b2b" emissiveIntensity={3.5} />
        </mesh>
        <pointLight distance={12} intensity={4} color="#ff6b2b" />
      </group>
    </group>
  );
};
