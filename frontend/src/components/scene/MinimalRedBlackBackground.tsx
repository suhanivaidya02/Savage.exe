import React, { useEffect, useRef } from 'react';

interface MinimalRedBlackBackgroundProps {
  scrollProgress: number;
  reduceMotion: boolean;
  stationColor?: string;
}

export const MinimalRedBlackBackground: React.FC<MinimalRedBlackBackgroundProps> = ({
  scrollProgress,
  reduceMotion,
  stationColor = '#ff1e42',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Minimal subtle floating red embers
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    let gridOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Deep Obsidian Base
      ctx.fillStyle = '#050203';
      ctx.fillRect(0, 0, width, height);

      // 2. Soft Ambient Radial Red Glows
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        50,
        width * 0.5,
        height * 0.35,
        width * 0.65
      );
      grad.addColorStop(0, 'rgba(255, 30, 66, 0.07)');
      grad.addColorStop(0.5, 'rgba(225, 29, 72, 0.025)');
      grad.addColorStop(1, 'rgba(5, 2, 3, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 3. Minimal Red Perspective Grid Floor (Lightweight & Smooth)
      const horizonY = height * 0.62;
      gridOffset = (gridOffset + 0.4) % 40;

      ctx.strokeStyle = 'rgba(255, 30, 66, 0.06)';
      ctx.lineWidth = 1;

      // Horizontal perspective lines
      for (let y = horizonY; y < height; y += 24 * Math.pow((y - horizonY) / (height - horizonY), 1.2) + 6) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vanishing point perspective lines
      const vanishingX = width * 0.5;
      const numRays = 18;
      for (let i = 0; i <= numRays; i++) {
        const bottomX = (width / numRays) * i;
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Horizon glow separator line
      ctx.strokeStyle = 'rgba(255, 30, 66, 0.18)';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();

      // 4. Subtle Floating Red Cyber Embers
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulse += 0.03;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        ctx.fillStyle = `rgba(255, 30, 66, ${currentOpacity})`;
        ctx.shadowColor = stationColor;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [reduceMotion, stationColor]);

  if (reduceMotion) {
    return <div className="fixed inset-0 pointer-events-none z-0 bg-[#050203]" />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
};

export default MinimalRedBlackBackground;
