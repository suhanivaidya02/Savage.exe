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
  stationColor = '#ff1e42',
  isMobile = false,
}) => {
  return (
    <>
      {/* Cinematic Cyber Atmosphere & Fog in Hot Red Obsidian */}
      <color attach="background" args={['#070305']} />
      <fogExp2 attach="fog" args={['#070305', 0.028]} />

      {/* Scene Lighting Architecture */}
      <ambientLight intensity={0.45} color="#1c070c" />
      <directionalLight
        position={[6, 12, 8]}
        intensity={1.6}
        color="#ffebee"
      />
      {/* Hot Red Cyber Fill Light */}
      <directionalLight position={[-8, 6, -5]} intensity={1.2} color="#ff1e42" />
      {/* Crimson/Amber Accent Rim Light */}
      <directionalLight position={[0, -4, -6]} intensity={0.8} color="#ff6b2b" />

      {/* Dynamic Station Spotlight targeting the EV Sedan */}
      <spotLight
        position={[0, 8, 2]}
        target-position={[0, 0.5, 0]}
        intensity={2.8}
        angle={0.65}
        penumbra={0.7}
        color={stationColor}
      />

      {/* Cyber City & Ground Grid */}
      <CyberGround />
      <CitySkyline />

      {/* Energy Sparks / Molten Embers */}
      {!isMobile && <ParticleField count={50} />}

      {/* The Central Procedural EV Sedan */}
      <EvSedan scrollProgress={scrollProgress} stationColor={stationColor} />

      {/* Scroll-Driven Camera Controller */}
      <ScrollCameraRig scrollProgress={scrollProgress} />
    </>
  );
};
