import React from 'react';
import { EvSedan } from './EvSedan';
import { CitySkyline } from './CitySkyline';
import { CyberGround } from './CyberGround';
import { ParticleField } from './ParticleField';
import { ScrollCameraRig } from './ScrollCameraRig';

interface ExperienceProps {
  scrollProgress: number;
  stationColor?: string;
  isMobile?: boolean;
}

export const Experience: React.FC<ExperienceProps> = ({
  scrollProgress,
  stationColor = '#00e5ff',
  isMobile = false,
}) => {
  return (
    <>
      {/* Cinematic Cyber Atmosphere & Fog */}
      <color attach="background" args={['#05080f']} />
      <fogExp2 attach="fog" args={['#05080f', 0.028]} />

      {/* Scene Lighting Architecture */}
      <ambientLight intensity={0.4} color="#0c1a2e" />
      <directionalLight
        position={[6, 12, 8]}
        intensity={1.5}
        color="#c8e4ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Cyan Cyber Fill Light */}
      <directionalLight position={[-8, 6, -5]} intensity={0.8} color="#00e5ff" />
      {/* Emerald Accent Rim Light */}
      <directionalLight position={[0, -4, -6]} intensity={0.6} color="#39ff88" />

      {/* Dynamic Station Spotlight targeting the EV Sedan */}
      <spotLight
        position={[0, 8, 2]}
        target-position={[0, 0.5, 0]}
        intensity={2.8}
        angle={0.65}
        penumbra={0.7}
        color={stationColor}
        castShadow
      />

      {/* Cyber City & Ground Grid */}
      <CyberGround />
      <CitySkyline />

      {/* Energy Sparks / Charging Motes */}
      {!isMobile && <ParticleField count={180} />}

      {/* The Central Procedural EV Sedan */}
      <EvSedan scrollProgress={scrollProgress} stationColor={stationColor} />

      {/* Scroll-Driven Camera Controller */}
      <ScrollCameraRig scrollProgress={scrollProgress} />
    </>
  );
};
