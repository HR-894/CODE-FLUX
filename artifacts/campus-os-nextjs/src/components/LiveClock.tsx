"use client";

import { useEffect, useState } from "react";

export default function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return <div className="h-12 w-32 animate-pulse bg-black/10 dark:bg-white/10 rounded-xl" />;
  }

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = (hours % 12 || 12).toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-baseline gap-1 text-foreground/90 font-mono tracking-tighter">
        <span className="text-3xl font-bold">{displayHours}:{minutes}</span>
        <span className="text-sm font-medium text-brand-500">:{seconds}</span>
        <span className="text-sm font-bold text-foreground/50 ml-1">{ampm}</span>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mt-1">
        {time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
}
