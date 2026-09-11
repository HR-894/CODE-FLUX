"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, Loader2 } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg-1",
    role: "ai",
    content: "Hi! I'm Dost. I noticed your attendance in CAP900 is below 75%. Would you like me to show you the upcoming assignments to help you catch up?",
  }
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulated AI Response based on simple keywords
    setTimeout(() => {
      let responseContent = "I can help you with your timetable, fee payments, or assignments. Just ask!";

      const lowerInput = newMsg.content.toLowerCase();
      if (lowerInput.includes("assignment") || lowerInput.includes("yes")) {
        responseContent = "You have an 'OS Memory Management Report' due tomorrow at 11:59 PM. I suggest you start on that! Need help finding resources?";
      } else if (lowerInput.includes("fee") || lowerInput.includes("pay")) {
        responseContent = "You have a pending tuition fee of ₹1,25,000 for Spring 2024. You can pay it directly from the Fee Statement page.";
      } else if (lowerInput.includes("rms") || lowerInput.includes("complaint")) {
        responseContent = "I see you have 1 pending RMS complaint regarding 'Attendance Discrepancy'. It's still being reviewed by the department.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: responseContent,
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-brand-600 to-amber-500 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(242,101,34,0.5)] z-40"
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* Chat Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-24 right-6 w-[360px] h-[500px] bg-background/80 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Campus AI</h3>
                  <p className="text-[10px] text-green-400 font-medium uppercase tracking-wider">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                      ? "bg-brand-500 text-white rounded-tr-sm"
                      : "bg-white/10 text-foreground rounded-tl-sm border border-white/5"
                    }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 p-4 rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                    <span className="text-xs text-muted-foreground">AI is thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/20 border-t border-white/10">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-foreground focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 p-2 bg-brand-500 text-white rounded-full hover:bg-brand-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
