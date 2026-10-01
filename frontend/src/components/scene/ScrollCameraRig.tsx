import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ScrollCameraRigProps {
  scrollProgress: number;
}

export const ScrollCameraRig: React.FC<ScrollCameraRigProps> = ({ scrollProgress }) => {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 3.2, 7.5));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.8, 0));

  // 6 Narrative Waypoints mapped to the 10 chapters
  const waypoints = [
    // 0.0 - Hero: 3/4 Isometric Showcase
    { t: 0.0, pos: new THREE.Vector3(3.2, 2.2, 6.0), lookAt: new THREE.Vector3(0, 0.6, 0) },
    // 0.18 - Problem: Low-Angle Tension / Silhouette
    { t: 0.18, pos: new THREE.Vector3(-4.5, 1.4, 4.2), lookAt: new THREE.Vector3(0, 0.7, 0.5) },
    // 0.35 - Fleet: High Vantage Overview of City Grid
    { t: 0.35, pos: new THREE.Vector3(0, 6.5, 9.0), lookAt: new THREE.Vector3(0, 0.4, -2) },
    // 0.52 - Agents: Energetic Orbiting Dynamic Angle
    { t: 0.52, pos: new THREE.Vector3(4.0, 1.8, 3.5), lookAt: new THREE.Vector3(0, 0.8, 0) },
    // 0.70 - Gantt & Savings: Orthogonal Mathematical Alignment
    { t: 0.70, pos: new THREE.Vector3(-2.8, 4.0, 5.5), lookAt: new THREE.Vector3(0, 0.5, 0) },
    // 0.88 - Disruptions: Dramatic Front View
    { t: 0.88, pos: new THREE.Vector3(0.5, 1.6, 5.2), lookAt: new THREE.Vector3(0, 0.7, 0) },
    // 1.0 - Approval: Triumphant Terminal Arrival
    { t: 1.0, pos: new THREE.Vector3(2.5, 2.0, 5.0), lookAt: new THREE.Vector3(0, 0.6, 0) },
  ];

  useFrame((state, delta) => {
    const t = Math.min(1, Math.max(0, scrollProgress));

    // Find surrounding waypoint bracket
    let p0 = waypoints[0];
    let p1 = waypoints[waypoints.length - 1];

    for (let i = 0; i < waypoints.length - 1; i++) {
      if (t >= waypoints[i].t && t <= waypoints[i + 1].t) {
        p0 = waypoints[i];
        p1 = waypoints[i + 1];
        break;
      }
    }

    // Segment progress factor
    const segmentSpan = p1.t - p0.t || 1;
    const factor = (t - p0.t) / segmentSpan;
    // Smooth cubic hermite easing
    const smoothFactor = factor * factor * (3 - 2 * factor);

    const targetPos = new THREE.Vector3().lerpVectors(p0.pos, p1.pos, smoothFactor);
    const targetLook = new THREE.Vector3().lerpVectors(p0.lookAt, p1.lookAt, smoothFactor);

    // Mouse subtle parallax tilt
    const mouseX = state.mouse.x * 0.4;
    const mouseY = state.mouse.y * 0.3;
    targetPos.x += mouseX;
    targetPos.y += mouseY;

    // Smooth camera lerp (60fps)
    currentPos.current.lerp(targetPos, delta * 3.5);
    currentLookAt.current.lerp(targetLook, delta * 3.5);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
