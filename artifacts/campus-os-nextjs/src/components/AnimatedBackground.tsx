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
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      
      {resolvedTheme === "light" ? (
        // LIGHT MODE - Premium Apple/Linear-style Ambient Mesh
        <div className="absolute inset-0 bg-slate-50">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-200/60 blur-[120px] mix-blend-multiply animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-amber-100/60 blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-rose-100/60 blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
          
          {/* Subtle Noise / Grid */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwwLDAsMC4wMikiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-50 z-20" />
        </div>
      ) : (
        // DARK MODE - Aurora / Ambient Mesh
        <div className="absolute inset-0 bg-black flex items-center justify-center">
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
