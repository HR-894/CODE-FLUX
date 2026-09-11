"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Tent, Utensils, CalendarRange, ShieldAlert, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OmniCommand() {
  const [open, setOpen] = useState(false);

  // Toggle with Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Floating Action Button for Mobile */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 p-4 bg-brand-500 text-white rounded-full shadow-[0_0_40px_-5px_rgba(242,101,34,0.5)] md:hidden flex items-center justify-center"
      >
        <Search size={24} />
      </motion.button>

      <Command.Dialog 
        open={open} 
        onOpenChange={setOpen}
        label="Global Command Menu"
        className="fixed inset-0 z-50 flex justify-center items-start pt-[15vh] md:pt-[20vh]"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md -z-10" onClick={() => setOpen(false)} />
        
        {/* Command Palette */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-[90vw] max-w-xl bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <div className="flex items-center px-4 py-4 border-b border-white/10">
                <Search className="text-zinc-500 mr-3" size={20} />
                <Command.Input 
                  placeholder="What do you need to do?" 
                  className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-600 focus:outline-none text-lg"
                />
                <div className="hidden md:flex gap-1 ml-2">
                  <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-zinc-500 font-mono tracking-widest">ESC</kbd>
                </div>
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                <Command.Empty className="py-12 text-center text-zinc-500 font-medium">
                  No commands found.
                </Command.Empty>

                <Command.Group heading="Quick Actions" className="text-xs font-bold text-zinc-500 uppercase tracking-widest p-2">
                  <Command.Item 
                    onSelect={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 mt-1 rounded-xl cursor-pointer text-zinc-300 aria-selected:bg-brand-500/20 aria-selected:text-brand-500 transition-colors"
                  >
                    <Tent size={18} />
                    <span className="font-medium text-sm">Apply for Hostel Leave</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-zinc-300 aria-selected:bg-brand-500/20 aria-selected:text-brand-500 transition-colors"
                  >
                    <Utensils size={18} />
                    <span className="font-medium text-sm">Check Today&apos;s Mess Menu</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Academics" className="text-xs font-bold text-zinc-500 uppercase tracking-widest p-2">
                  <Command.Item 
                    onSelect={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 mt-1 rounded-xl cursor-pointer text-zinc-300 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                  >
                    <GraduationCap size={18} />
                    <span className="font-medium text-sm">View Attendance (UMS)</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-zinc-300 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                  >
                    <CalendarRange size={18} />
                    <span className="font-medium text-sm">Full Timetable</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Support" className="text-xs font-bold text-zinc-500 uppercase tracking-widest p-2">
                  <Command.Item 
                    onSelect={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 mt-1 rounded-xl cursor-pointer text-zinc-300 aria-selected:bg-red-500/20 aria-selected:text-red-400 transition-colors"
                  >
                    <ShieldAlert size={18} />
                    <span className="font-medium text-sm">Register IT Complaint</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </motion.div>
          )}
        </AnimatePresence>
      </Command.Dialog>
    </>
  );
}
