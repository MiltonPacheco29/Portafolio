"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { reducedMotionConfig } from "@/lib/animations";

// Red de seguridad: con prefers-reduced-motion, Motion no anima transformaciones
// ni layout en ningún componente, aunque alguno olvide usar lib/animations.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion={reducedMotionConfig}>{children}</MotionConfig>;
}
