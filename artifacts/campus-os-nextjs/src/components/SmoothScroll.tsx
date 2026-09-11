"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.15, wheelMultiplier: 1.5 }}>
      {children}
    </ReactLenis>
  );
}
