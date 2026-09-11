"use client";

import { useState } from "react";
import { Drawer } from "vaul";
import { CreditCard, CheckCircle2, Loader2 } from "lucide-react";

interface PaymentDrawerProps {
  amount: number;
  description: string;
}

export default function PaymentDrawer({ amount, description }: PaymentDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  const handlePayment = () => {
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
          <CreditCard className="w-5 h-5" />
          Pay ₹{amount.toLocaleString("en-IN")}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Drawer.Content className="bg-background border-t border-white/10 flex flex-col rounded-t-[32px] h-[80vh] sm:h-auto sm:max-h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none">
          <div className="p-4 bg-background rounded-t-[32px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/20 mb-8" />
            <div className="max-w-md mx-auto w-full">
              <Drawer.Title className="font-semibold text-2xl mb-2">Secure Checkout</Drawer.Title>
              <Drawer.Description className="text-muted-foreground mb-8">
                You are paying for {description}.
              </Drawer.Description>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Amount Due</span>
                  <span className="text-2xl font-bold">₹{amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Convenience Fee</span>
                  <span>₹0.00</span>
                </div>
                <hr className="border-white/10 my-4" />
                <div className="flex justify-between items-center font-medium">
                  <span>Total Payable</span>
                  <span className="text-brand-400">₹{amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {status === "idle" && (
                <div className="space-y-4">
                  <button
                    onClick={handlePayment}
                    className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-semibold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Pay via UPI / Card
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {status === "processing" && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
                  <p className="font-medium animate-pulse">Processing Payment...</p>
                </div>
              )}

              {status === "success" && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-green-500">
                  <CheckCircle2 className="w-16 h-16" />
                  <p className="font-semibold text-xl">Payment Successful!</p>
                  <p className="text-sm text-green-500/70">Receipt sent to your email.</p>
                </div>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
