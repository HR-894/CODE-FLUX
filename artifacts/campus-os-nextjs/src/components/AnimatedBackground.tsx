"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-black">
      {/* SVG filter for the Gooey Oil Paint Effect */}
      <svg className="hidden">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -30" />
        </filter>
      </svg>

      {resolvedTheme === "light" ? (
        // LIGHT MODE - Fluid Oil Paint
        <div className="absolute inset-0 bg-white" style={{ filter: "url(#goo)" }}>
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-brand-400/80 mix-blend-multiply animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-amber-300/80 mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-rose-300/80 mix-blend-multiply animate-blob animation-delay-4000" />
        </div>
      ) : (
        // DARK MODE - Aurora / Ambient Mesh
        <div className="absolute inset-0 bg-black">
          {/* Deep Space Background gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/60 via-black to-black z-10" />
          
          {/* Animated Aurora Nebulas */}
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-600/30 blur-[120px] mix-blend-screen animate-blob z-0" />
          <div className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen animate-blob animation-delay-2000 z-0" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-amber-600/20 blur-[120px] mix-blend-screen animate-blob animation-delay-4000 z-0" />
          
          {/* Subtle Grid overlay for that OS feel */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-30 z-20" />
        </div>
      )}
    </div>
  );
}
