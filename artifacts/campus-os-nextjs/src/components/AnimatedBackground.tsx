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
        // DARK MODE - Quasar / Black Hole Event Horizon
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-90 z-10" />
          
          {/* Rotating Accretion Disk (Quasar) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] opacity-40 mix-blend-screen" style={{ filter: "url(#goo)" }}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-600 via-purple-900 to-amber-600 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-10 rounded-full bg-gradient-to-bl from-indigo-600 via-rose-900 to-brand-900 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-20 rounded-full bg-gradient-to-t from-black via-transparent to-black animate-[spin_25s_linear_infinite]" />
          </div>

          {/* Core singularity */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20vw] h-[20vw] rounded-full bg-black shadow-[0_0_100px_40px_rgba(0,0,0,1)] z-20" />
          
          {/* Subtle Grid overlay for that OS feel */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-20 z-30" />
        </div>
      )}
    </div>
  );
}
