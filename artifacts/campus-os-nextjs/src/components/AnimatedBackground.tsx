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

  if (resolvedTheme === "light") {
    return (
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-zinc-50">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/20 blur-[120px] mix-blend-multiply animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-amber-500/20 blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] rounded-full bg-blue-500/20 blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
      </div>
    );
  }

  // Dark / Space theme
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-black">
      {/* Deep Space Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80" />
      
      {/* Animated Nebulas */}
      <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-900/40 blur-[150px] mix-blend-screen animate-blob" />
      <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/40 blur-[150px] mix-blend-screen animate-blob animation-delay-2000" />
      <div className="absolute top-[30%] left-[30%] w-[50%] h-[50%] rounded-full bg-amber-900/20 blur-[150px] mix-blend-screen animate-blob animation-delay-4000" />
      
      {/* Subtle Grid overlay for that OS feel */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-30" />
    </div>
  );
}
