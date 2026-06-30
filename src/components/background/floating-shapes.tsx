"use client";

import { motion } from "framer-motion";

export function FloatingShapes() {
  const shapes = [
    { type: "circle", size: 60, x: "10%", y: "30%", delay: 0 },
    { type: "square", size: 40, x: "85%", y: "20%", delay: 1 },
    { type: "triangle", size: 50, x: "75%", y: "70%", delay: 2 },
    { type: "circle", size: 30, x: "20%", y: "80%", delay: 1.5 },
    { type: "square", size: 25, x: "50%", y: "15%", delay: 0.5 },
    { type: "hexagon", size: 45, x: "15%", y: "60%", delay: 2.5 }
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: shape.x, top: shape.y }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15 + i * 2,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {shape.type === "circle" && (
            <div
              className="rounded-full border border-violet-400/20 bg-violet-400/5"
              style={{ width: shape.size, height: shape.size }}
            />
          )}
          {shape.type === "square" && (
            <div
              className="border border-cyan-400/20 bg-cyan-400/5 backdrop-blur-sm"
              style={{ width: shape.size, height: shape.size, transform: "rotate(45deg)" }}
            />
          )}
          {shape.type === "triangle" && (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid rgba(236, 72, 153, 0.1)`
              }}
            />
          )}
          {shape.type === "hexagon" && (
            <div
              className="border border-amber-400/20 bg-amber-400/5"
              style={{
                width: shape.size,
                height: shape.size,
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
