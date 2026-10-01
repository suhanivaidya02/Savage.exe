import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RichMinimal3DBackgroundProps {
  scrollProgress: number;
  reduceMotion: boolean;
  stationColor?: string;
}

// -------------------------------------------------------------
// 1. Luxury Kinetic Gyroscopic Core & Crystalline Polyhedron
// -------------------------------------------------------------
const KineticCore: React.FC<{
  scrollProgress: number;
  stationColor: string;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}> = ({ scrollProgress, stationColor, mouse }) => {
  const masterGroupRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const middleRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const wireCoreRef = useRef<THREE.Mesh>(null);
  const tickNotchesRef = useRef<THREE.Points>(null);

  // Precision tick notches on the outer orbital ring
  const tickPositions = useMemo(() => {
    const count = 48;
    const pos = new Float32Array(count * 3);
    const radius = 2.95;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = Math.sin(theta) * radius;
      pos[i * 3 + 2] = 0;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Smooth Mouse Parallax Tilt
    if (masterGroupRef.current) {
      const targetRotX = mouse.current.y * 0.14 + (scrollProgress - 0.5) * 0.4;
      const targetRotY = mouse.current.x * 0.18;
      masterGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.x,
        targetRotX,
        delta * 3.0
      );
      masterGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.y,
        targetRotY,
        delta * 3.0
      );

      // Subtle vertical parallax drift based on scroll
      const targetY = (scrollProgress - 0.5) * -1.4 + Math.sin(time * 0.4) * 0.08;
      masterGroupRef.current.position.y = THREE.MathUtils.lerp(
        masterGroupRef.current.position.y,
        targetY,
        delta * 2.5
      );
    }

    // 2. Counter-rotating Gyroscopic Rings (Calculated, Hypnotic Speeds)
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.09;
      outerRingRef.current.rotation.y += delta * 0.05;
    }
    if (middleRingRef.current) {
      middleRingRef.current.rotation.x += delta * 0.13;
      middleRingRef.current.rotation.z -= delta * 0.11;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.17;
      innerRingRef.current.rotation.x += delta * 0.08;
    }

    // 3. Faceted Gem Core Rotation & Harmonic Breathing
    if (coreMeshRef.current && wireCoreRef.current) {
      coreMeshRef.current.rotation.x += delta * 0.22;
      coreMeshRef.current.rotation.y += delta * 0.18;
      wireCoreRef.current.rotation.x = coreMeshRef.current.rotation.x;
      wireCoreRef.current.rotation.y = coreMeshRef.current.rotation.y;

      const breathe = 1.0 + Math.sin(time * 1.4) * 0.045;
      coreMeshRef.current.scale.set(breathe, breathe, breathe);
      wireCoreRef.current.scale.set(breathe * 1.08, breathe * 1.08, breathe * 1.08);
    }

    // 4. Tick notches rotate with outer ring
    if (tickNotchesRef.current && outerRingRef.current) {
      tickNotchesRef.current.rotation.z = outerRingRef.current.rotation.z;
      tickNotchesRef.current.rotation.y = outerRingRef.current.rotation.y;
    }
  });

  return (
    <group ref={masterGroupRef} position={[0, 0, 0]}>
      {/* Center Ruby/Crimson Point Light inside Core */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2.2}
        distance={10}
        decay={2}
        color={stationColor}
      />

      {/* OUTER TITANIUM RING */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2.85, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#160c10"
          metalness={0.94}
          roughness={0.16}
          emissive="#24070e"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* OUTER RING TICK NOTCHES */}
      <points ref={tickNotchesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={tickPositions.length / 3}
            array={tickPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color={stationColor}
          transparent
          opacity={0.45}
        />
      </points>

      {/* MIDDLE GYROSCOPIC CRIMSON ACCENT RING */}
      <mesh ref={middleRingRef} rotation={[0.65, 0.4, 0]}>
        <torusGeometry args={[2.2, 0.024, 16, 90]} />
        <meshStandardMaterial
          color="#22070d"
          metalness={0.9}
          roughness={0.22}
          emissive={stationColor}
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* INNER GIMBAL RING */}
      <mesh ref={innerRingRef} rotation={[-0.5, 0.8, 0]}>
        <torusGeometry args={[1.58, 0.018, 16, 80]} />
        <meshStandardMaterial
          color="#14080b"
          metalness={0.96}
          roughness={0.12}
          emissive="#380914"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* CENTRAL FACETED STEALTH ICOSAHEDRON (Solid core with flat shading for rich facets) */}
      <mesh ref={coreMeshRef}>
        <icosahedronGeometry args={[0.78, 0]} />
        <meshStandardMaterial
          color="#150508"
          roughness={0.15}
          metalness={0.88}
          flatShading={true}
          emissive={stationColor}
          emissiveIntensity={0.28}
        />
      </mesh>

      {/* DELICATE WIREFRAME CAGE AROUND THE CORE */}
      <mesh ref={wireCoreRef}>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshBasicMaterial
          wireframe={true}
          color={stationColor}
          transparent={true}
          opacity={0.32}
        />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 2. Ethereal Micro-Particle Stardust Cloud (Non-glaring Depth)
// -------------------------------------------------------------
const StardustWave: React.FC<{ count?: number; stationColor: string }> = ({
  count = 280,
  stationColor,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const primary = new THREE.Color(stationColor);
    const deepCrimson = new THREE.Color('#7f1d1d');
    const titaniumDark = new THREE.Color('#334155');
    const warmFlame = new THREE.Color('#ea580c');

    for (let i = 0; i < count; i++) {
      // Cylindrical volumetric field spread
      const radius = 2.5 + Math.random() * 9.5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 11;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius - 2;

      // Color palette tuned to be luxurious and soft
      const rand = Math.random();
      const chosenColor =
        rand > 0.65 ? primary : rand > 0.35 ? deepCrimson : rand > 0.15 ? titaniumDark : warmFlame;

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }
    return [pos, col];
  }, [count, stationColor]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();

    // Gentle global orbit
    pointsRef.current.rotation.y = time * 0.025;
    pointsRef.current.rotation.z = Math.sin(time * 0.08) * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        vertexColors
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// -------------------------------------------------------------
// 3. Subtle Perspective Floor Grid (Soft Horizon Anchor)
// -------------------------------------------------------------
const SubtleFloorGrid: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!gridRef.current) return;
    // Slow infinite forward motion
    gridRef.current.position.z = (gridRef.current.position.z + delta * 0.35) % 2;
  });

  return (
    <group position={[0, -3.4, 0]}>
      <group ref={gridRef}>
        <gridHelper
          args={[36, 36, '#ff1e42', '#2a0a12']}
          position={[0, 0, 0]}
        />
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// 4. Main Scene Manager
// -------------------------------------------------------------
const SceneCanvas: React.FC<{
  scrollProgress: number;
  stationColor: string;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}> = ({ scrollProgress, stationColor, mouse }) => {
  return (
    <>
      {/* Deep Obsidian Background & Exponential Distance Fog */}
      <color attach="background" args={['#040204']} />
      <fogExp2 attach="fog" args={['#040204', 0.042]} />

      {/* Cinematic Studio Lighting Architecture */}
      <ambientLight intensity={0.55} color="#1c070e" />

      {/* Main Specular Key Light (Crisp reflections on metallic rings) */}
      <directionalLight position={[6, 9, 6]} intensity={1.4} color="#ffffff" />

      {/* Hot Red Fill Light from left */}
      <directionalLight position={[-7, 2, -3]} intensity={1.1} color={stationColor} />

      {/* Deep Crimson Backlight for subtle edge contours */}
      <directionalLight position={[0, -5, -6]} intensity={0.7} color="#ff3355" />

      {/* Core Kinetic Gyroscope & Cyber Polyhedron */}
      <KineticCore
        scrollProgress={scrollProgress}
        stationColor={stationColor}
        mouse={mouse}
      />

      {/* Ambient Stardust Wave */}
      <StardustWave count={260} stationColor={stationColor} />

      {/* Subtle Distant Perspective Floor */}
      <SubtleFloorGrid scrollProgress={scrollProgress} />
    </>
  );
};

// -------------------------------------------------------------
// 5. Exported Component
// -------------------------------------------------------------
export const RichMinimal3DBackground: React.FC<RichMinimal3DBackgroundProps> = ({
  scrollProgress,
  reduceMotion,
  stationColor = '#ff1e42',
}) => {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to [-1, 1]
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Graceful fallback if reduceMotion is active
  if (reduceMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#040204]">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 40%, rgba(255, 30, 66, 0.12) 0%, transparent 60%)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#040204]">
      {/* Three.js R3F WebGL Layer */}
      <Canvas
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 7.8], fov: 42 }}
        className="w-full h-full"
      >
        <SceneCanvas
          scrollProgress={scrollProgress}
          stationColor={stationColor}
          mouse={mouse}
        />
      </Canvas>

      {/* Luxurious Vignette & Ambient Radial Mask: Keeps text crystal-clear, zero glare */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(4, 2, 4, 0.15) 0%, rgba(4, 2, 4, 0.65) 60%, #040204 100%)',
        }}
      />

      {/* Subtle Horizon Glow Line (Micro-detail) */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#040204] via-[#040204]/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default RichMinimal3DBackground;
