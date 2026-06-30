"use client";

import { motion } from "framer-motion";

interface Orb {
  id: number;
  size: number;
  x: string;
  y: string;
  color: string;
  duration: number;
  delay: number;
}

const orbs: Orb[] = [
  {
    id: 1,
    size: 500,
    x: "10%",
    y: "10%",
    color: "rgba(167, 139, 250, 0.25)",
    duration: 20,
    delay: 0
  },
  {
    id: 2,
    size: 400,
    x: "70%",
    y: "20%",
    color: "rgba(34, 211, 238, 0.2)",
    duration: 25,
    delay: 2
  },
  {
    id: 3,
    size: 450,
    x: "50%",
    y: "70%",
    color: "rgba(236, 72, 153, 0.18)",
    duration: 22,
    delay: 4
  },
  {
    id: 4,
    size: 350,
    x: "85%",
    y: "75%",
    color: "rgba(251, 191, 36, 0.15)",
    duration: 28,
    delay: 1
  }
];

export function AuroraOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`
          }}
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
