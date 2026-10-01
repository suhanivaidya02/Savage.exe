import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './Experience';

interface SceneBackgroundProps {
  scrollProgress: number;
  reduceMotion: boolean;
  activeSection?: string;
  stationColor?: string;
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({
  scrollProgress,
  reduceMotion,
  stationColor = '#00e5ff',
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If user requests reduced motion, unmount WebGL Canvas to save CPU/GPU
  if (reduceMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#05080f] bg-cyber-grid opacity-40" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <Suspense fallback={<div className="w-full h-full bg-[#05080f]" />}>
        <Canvas
          dpr={1}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          camera={{ position: [3.2, 2.2, 6.0], fov: 45 }}
        >
          <Experience
            scrollProgress={scrollProgress}
            stationColor={stationColor}
            isMobile={isMobile}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default SceneBackground;
