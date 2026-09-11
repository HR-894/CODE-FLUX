"use client";

import { motion, useMotionValue } from "framer-motion";

const SPRING_PHYSICS = { type: "spring", stiffness: 400, damping: 25 } as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: SPRING_PHYSICS },
};

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: string;
  rowSpan?: string;
}

// 3D Card Wrapper - Subtler tilt and smoother transitions
export default function TiltCard({ children, className = "", colSpan = "col-span-1", rowSpan = "row-span-1" }: TiltCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    // Significantly reduced the multiplier (from 0.15 to 0.04) for a very subtle, high-end feel
    const x = (clientX - left - width / 2) * 0.04;
    const y = (clientY - top - height / 2) * 0.04;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.article 
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: mouseY, rotateY: mouseX, transformPerspective: 1200 }}
      whileTap={{ scale: 0.98 }} // Gentler tap scale
      className={`${colSpan} ${rowSpan} relative overflow-hidden rounded-[2rem] bg-panel-bg backdrop-blur-3xl border border-panel-border p-6 flex flex-col group transition-all duration-500 ease-out hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/5 ${className}`}
    >
      {/* Subtle Gloss reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </motion.article>
  );
}
