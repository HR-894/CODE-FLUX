"use client";

import { useState } from "react";
import { Drawer } from "vaul";
import { Plus, CheckCircle2, Loader2, ImagePlus } from "lucide-react";

export default function RMSNewTicketForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("processing");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
      }, 2000);
    }, 1500);
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger asChild>
        <button className="w-full sm:w-auto px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-medium rounded-2xl transition-all shadow-lg shadow-brand-500/20 active:scale-95 flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Log New Request
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Drawer.Content className="bg-background border-t border-white/10 flex flex-col rounded-t-[32px] h-[90vh] sm:h-auto sm:max-h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none">
          <div className="p-4 bg-background rounded-t-[32px] flex-1 overflow-y-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/20 mb-8" />
            <div className="max-w-xl mx-auto w-full">
              <Drawer.Title className="font-semibold text-2xl mb-2">Log New Request</Drawer.Title>
              <Drawer.Description className="text-muted-foreground mb-8">
                Submit a new complaint, suggestion, or query to the administration.
              </Drawer.Description>

              {status === "idle" && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Category</label>
                      <select 
                        required 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all appearance-none"
                      >
                        <option value="" disabled className="bg-background text-muted-foreground">Select a category</option>
                        <option value="hostel" className="bg-background text-foreground">Hostel Maintenance</option>
                        <option value="it" className="bg-background text-foreground">IT Infrastructure</option>
                        <option value="academics" className="bg-background text-foreground">Academics</option>
                        <option value="fee" className="bg-background text-foreground">Fee Related</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Sub-Category</label>
                      <select 
                        required 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all appearance-none"
                      >
                        <option value="" disabled className="bg-background text-muted-foreground">Select a sub-category</option>
                        {category === "hostel" && (
                          <>
                            <option value="plumbing" className="bg-background text-foreground">Plumbing</option>
                            <option value="electrical" className="bg-background text-foreground">Electrical</option>
                            <option value="cleaning" className="bg-background text-foreground">Cleaning</option>
                          </>
                        )}
                        {category === "it" && (
                          <>
                            <option value="wifi" className="bg-background text-foreground">Wi-Fi / Network</option>
                            <option value="ums" className="bg-background text-foreground">UMS Portal Issue</option>
                          </>
                        )}
                        {!category && <option value="general" className="bg-background text-foreground">Select category first</option>}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Description</label>
                      <textarea 
                        required
                        placeholder="Provide detailed information about your issue..."
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Attachments (Optional)</label>
                      <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-white/5 hover:border-brand-500/50 transition-colors cursor-pointer group">
                        <ImagePlus className="w-8 h-8 mb-3 group-hover:text-brand-400 transition-colors" />
                        <p className="text-sm">Click or drag image to upload</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-2xl transition-all active:scale-95 shadow-lg shadow-brand-500/20"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              )}

              {status === "processing" && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
                  <p className="font-medium animate-pulse text-lg">Submitting Request...</p>
                </div>
              )}

              {status === "success" && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-green-500">
                  <CheckCircle2 className="w-20 h-20" />
                  <p className="font-bold text-2xl">Request Logged Successfully!</p>
                  <p className="text-sm text-green-500/70">Your tracking ID is RMS-2024-1052</p>
                </div>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
