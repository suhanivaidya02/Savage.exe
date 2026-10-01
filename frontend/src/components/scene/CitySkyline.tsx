import React, { useMemo } from 'react';
import * as THREE from 'three';

export const CitySkyline: React.FC = () => {
  // Distant Cyberpunk Metropolis Silhouette (Far in the background, z <= -45)
  // Perfectly framing the central EV showcase without obstructing the camera
  const { towers, spires } = useMemo(() => {
    const towerList: {
      position: [number, number, number];
      scale: [number, number, number];
      color: string;
      hasCrown: boolean;
      windowRows: number;
    }[] = [];

    // Distant city skyline backdrop array (spread wide: x from -55 to +55, z from -50 to -75)
    const coordinates: [number, number, number, number, number, string][] = [
      // Far Left Cluster
      [-50, -55, 6, 32, 6, '#ff1e42'],
      [-42, -50, 5, 26, 5, '#ff6b2b'],
      [-35, -58, 7, 40, 7, '#e11d48'],
      [-28, -52, 6, 28, 6, '#ff3366'],
      [-22, -60, 8, 48, 8, '#ff1e42'], // Iconic supertall
      [-16, -55, 5, 24, 5, '#ffaa00'],
      
      // Far Right Cluster
      [16, -55, 5, 24, 5, '#ffaa00'],
      [22, -60, 8, 48, 8, '#ff1e42'], // Iconic supertall
      [28, -52, 6, 28, 6, '#ff3366'],
      [35, -58, 7, 40, 7, '#e11d48'],
      [42, -50, 5, 26, 5, '#ff6b2b'],
      [50, -55, 6, 32, 6, '#ff1e42'],

      // Deep Horizon Center Gap Fillers (Low-profile so car is completely unobstructed)
      [-8, -75, 4, 18, 4, '#ff1e42'],
      [0, -78, 5, 20, 5, '#ff6b2b'],
      [8, -75, 4, 18, 4, '#ff3366'],
    ];

    coordinates.forEach(([x, z, w, h, d, color], i) => {
      towerList.push({
        position: [x, h / 2 - 0.5, z],
        scale: [w, h, d],
        color,
        hasCrown: i % 2 === 0,
        windowRows: Math.floor(h / 5),
      });
    });

    // Communication laser spires
    const spireList: [number, number, number, string][] = [
      [-22, 50, -60, '#ff1e42'],
      [22, 50, -60, '#ff1e42'],
      [-35, 42, -58, '#ff6b2b'],
      [35, 42, -58, '#ff6b2b'],
    ];

    return { towers: towerList, spires: spireList };
  }, []);

  return (
    <group>
      {/* Distant Skyscrapers */}
      {towers.map((t, i) => (
        <group key={i} position={t.position}>
          {/* Main Dark Obsidian Monolith */}
          <mesh scale={t.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#080205"
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>

          {/* Glowing Rooftop Crown Edge */}
          {t.hasCrown && (
            <mesh position={[0, t.scale[1] / 2 + 0.15, 0]}>
              <boxGeometry args={[t.scale[0] * 0.98, 0.3, t.scale[2] * 0.98]} />
              <meshStandardMaterial
                color={t.color}
                emissive={t.color}
                emissiveIntensity={3.5}
              />
            </mesh>
          )}

          {/* High-tech Vertical Data Conduit Ribbon */}
          <mesh position={[0, 0, t.scale[2] / 2 + 0.05]}>
            <planeGeometry args={[0.35, t.scale[1] * 0.85]} />
            <meshStandardMaterial
              color={t.color}
              emissive={t.color}
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>
      ))}

      {/* Futuristic Depot S1/S2 Laser Communication Spires */}
      {spires.map(([x, y, z, color], idx) => (
        <group key={idx} position={[x, y, z]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.4, 24, 6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4.5} />
          </mesh>
          {/* Beacon light at tip */}
          <mesh position={[0, 12, 0]}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={6.0} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
