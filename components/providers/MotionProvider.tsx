"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { reducedMotionConfig } from "@/lib/animations";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion={reducedMotionConfig}>{children}</MotionConfig>;
}
