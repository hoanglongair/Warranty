"use client";

import { useEffect, useState } from "react";

export function CursorGradient() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-500"
      style={{
        background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, 0.08), transparent 50%)`
      }}
    />
  );
}
