import React, { useMemo } from 'react';

export const CitySkyline: React.FC = () => {
  // Lightweight 16 iconic cyberpunk skyline monoliths
  const { buildings } = useMemo(() => {
    const list: { position: [number, number, number]; scale: [number, number, number]; hasBeacon: boolean; color: string }[] = [];
    
    // Left cityscape silhouette (8 towers)
    const leftCoords: [number, number, number, number, number][] = [
      [-12, -15, 3.2, 16, 3.5],
      [-16, -5, 4.0, 22, 4.2],
      [-21, 5, 3.8, 14, 3.8],
      [-14, 15, 3.5, 18, 3.6],
      [-24, -10, 4.5, 26, 4.5],
      [-22, 18, 3.6, 20, 3.6],
      [-18, 25, 4.2, 15, 4.0],
      [-26, 8, 4.8, 24, 4.5],
    ];

    // Right cityscape silhouette (8 towers)
    const rightCoords: [number, number, number, number, number][] = [
      [12, -15, 3.2, 16, 3.5],
      [16, -5, 4.0, 22, 4.2],
      [21, 5, 3.8, 14, 3.8],
      [14, 15, 3.5, 18, 3.6],
      [24, -10, 4.5, 26, 4.5],
      [22, 18, 3.6, 20, 3.6],
      [18, 25, 4.2, 15, 4.0],
      [26, 8, 4.8, 24, 4.5],
    ];

    [...leftCoords, ...rightCoords].forEach(([x, z, w, h, d], i) => {
      list.push({
        position: [x, h / 2 - 0.5, z],
        scale: [w, h, d],
        hasBeacon: i % 2 === 0,
        color: i % 3 === 0 ? '#ff6b2b' : '#ff1e42',
      });
    });

    return { buildings: list };
  }, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <group key={i} position={b.position}>
          {/* Main Obsidian Tower */}
          <mesh scale={b.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#0c0407"
              metalness={0.85}
              roughness={0.35}
            />
          </mesh>

          {/* Glowing Rooftop Beacon */}
          {b.hasBeacon && (
            <mesh position={[0, b.scale[1] / 2 + 0.1, 0]}>
              <boxGeometry args={[b.scale[0] * 0.95, 0.15, b.scale[2] * 0.95]} />
              <meshStandardMaterial
                color={b.color}
                emissive={b.color}
                emissiveIntensity={2.8}
              />
            </mesh>
          )}

          {/* Emissive Vertical Laser Core Ribbon */}
          <mesh position={[0, 0, b.scale[2] / 2 + 0.02]}>
            <planeGeometry args={[0.2, b.scale[1] * 0.75]} />
            <meshStandardMaterial
              color={b.color}
              emissive={b.color}
              emissiveIntensity={2.2}
            />
          </mesh>
        </group>
      ))}

      {/* Distant Depot S1/S2 Spire Antennas */}
      <group position={[-16, 12, -22]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.3, 16, 6]} />
          <meshStandardMaterial color="#ff1e42" emissive="#ff1e42" emissiveIntensity={3.5} />
        </mesh>
      </group>

      <group position={[16, 12, -22]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.3, 16, 6]} />
          <meshStandardMaterial color="#ff6b2b" emissive="#ff6b2b" emissiveIntensity={3.5} />
        </mesh>
      </group>
    </group>
  );
};
