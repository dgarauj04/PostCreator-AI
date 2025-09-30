import React, { useRef, useEffect } from 'react';

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface SquaresProps {
  borderColor?: CanvasStrokeStyle;
  squareSize?: number;
  hoverFillColor?: CanvasStrokeStyle;
  trailLength?: number;
  fadeSpeed?: number;
}

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  timestamp: number;
}

const Background: React.FC<SquaresProps> = ({
  borderColor = '#545676ff',
  squareSize = 40,
  hoverFillColor = '#ff0000ff',
  trailLength = 6,
  fadeSpeed = 0.05
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const trailRef = useRef<TrailPoint[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let x = 0; x < canvas.width + squareSize; x += squareSize) {
        for (let y = 0; y < canvas.height + squareSize; y += squareSize) {
          ctx.strokeStyle = borderColor;
          ctx.strokeRect(x, y, squareSize, squareSize);
        }
      }

      const now = Date.now();

      trailRef.current = trailRef.current.map((point) => ({
        ...point,
        opacity: point.opacity - fadeSpeed
      })).filter((point) => point.opacity > 0);

      trailRef.current.forEach((point) => {
        ctx.fillStyle = hoverFillColor.toString().includes('rgba') ? hoverFillColor : `rgba(${hexToRgb(hoverFillColor as string)}, ${point.opacity})`;
        ctx.fillRect(point.x * squareSize, point.y * squareSize, squareSize, squareSize);

        ctx.strokeStyle = borderColor;
        ctx.strokeRect(point.x * squareSize, point.y * squareSize, squareSize, squareSize);
      });

     const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );
      gradient.addColorStop(0, '#0f172a1a'); 
      gradient.addColorStop(1, '#0f172acc');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const hoveredSquareX = Math.floor(mouseX / squareSize);
      const hoveredSquareY = Math.floor(mouseY / squareSize);

      if (mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height) {
        const existingPointIndex = trailRef.current.findIndex(
          point => point.x === hoveredSquareX && point.y === hoveredSquareY
        );

        if (existingPointIndex === -1) {
          trailRef.current.push({
            x: hoveredSquareX,
            y: hoveredSquareY,
            opacity: 1,
            timestamp: Date.now()
          });

          if (trailRef.current.length > trailLength) {
            trailRef.current.shift();
          } 
        } else {
          trailRef.current[existingPointIndex].opacity = 1;
          trailRef.current[existingPointIndex].timestamp = Date.now();
        }
      }
    };

    const handleMouseLeave = () => {
    };

    const animationLoop = () => {
      drawGrid();
      requestRef.current = requestAnimationFrame(animationLoop);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    requestRef.current = requestAnimationFrame(animationLoop);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [borderColor, hoverFillColor, squareSize, trailLength, fadeSpeed]);

  const hexToRgb = (hex: string): string => {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
  }

  return (
    <canvas 
      ref={canvasRef} 
      className="background-canvas"
    />
  );
};

export default Background;