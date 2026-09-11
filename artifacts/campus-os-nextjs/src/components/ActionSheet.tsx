"use client";

import React from "react";
import { Drawer } from "vaul";
import { X, Send } from "lucide-react";
import { motion } from "framer-motion";

interface ActionSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ActionSheet({ 
  isOpen, 
  onOpenChange, 
  title, 
  description, 
  children 
}: ActionSheetProps) {
  return (
    <Drawer.Root 
      open={isOpen} 
      onOpenChange={onOpenChange} 
      shouldScaleBackground
      snapPoints={[0.5, 1]}
      fadeFromIndex={0}
    >
      <Drawer.Portal>
        {/* Deep blur backdrop for that premium glassmorphism feel */}
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        
        <Drawer.Content className="bg-zinc-950/90 backdrop-blur-3xl flex flex-col rounded-t-[2rem] border border-white/10 mt-24 h-full max-h-[90vh] fixed bottom-0 left-0 right-0 z-50 focus:outline-none">
          {/* Drag Handle */}
          <div className="p-4 rounded-t-[2rem] flex-shrink-0 flex justify-center items-center">
            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
          </div>

          <div className="px-6 pb-6 flex-1 overflow-y-auto scrollbar-hide">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Drawer.Title className="text-2xl font-bold text-zinc-100 mb-1">
                  {title}
                </Drawer.Title>
                <Drawer.Description className="text-zinc-400 font-medium text-sm">
                  {description}
                </Drawer.Description>
              </div>
              <Drawer.Close asChild>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </Drawer.Close>
            </div>
            
            {/* Form/Content injected here */}
            {children}
            
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

// Example usage component for the "Apply for Leave" sheet
export function LeaveRequestSheet({ isOpen, setOpen }: { isOpen: boolean, setOpen: (v: boolean) => void }) {
  return (
    <ActionSheet 
      isOpen={isOpen} 
      onOpenChange={setOpen}
      title="Apply for Leave"
      description="Route your request directly to your warden (BH-4)."
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setOpen(false); }}>
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Leave Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-500 font-semibold text-sm">
              Weekend
            </button>
            <button type="button" className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 font-semibold text-sm">
              Medical
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Reason</label>
          <textarea 
            className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none h-24"
            placeholder="Going home for the weekend..."
          />
        </div>
        <motion.button 
          whileTap={{ scale: 0.97 }}
          className="w-full mt-4 bg-brand-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
        >
          <Send size={18} />
          Submit Request
        </motion.button>
      </form>
    </ActionSheet>
  );
}
