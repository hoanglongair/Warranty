"use client";

import { AuroraOrbs } from "./aurora-orbs";
import { ParticleField } from "./particle-field";
import { FloatingShapes } from "./floating-shapes";
import { CursorGradient } from "./cursor-gradient";

export function AnimatedBackground() {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-[hsl(var(--background))]" />
      <div className="fixed inset-0 -z-10 grid-pattern opacity-30" />
      <CursorGradient />
      <div className="fixed inset-0 -z-10">
        <AuroraOrbs />
      </div>
      <div className="fixed inset-0 -z-10">
        <FloatingShapes />
      </div>
      <div className="fixed inset-0 -z-10">
        <ParticleField count={50} />
      </div>
    </>
  );
}
