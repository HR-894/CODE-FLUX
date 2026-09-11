"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_ANNOUNCEMENTS } from "@/lib/mock-data";

const TABS = ["All", "Academic", "Admin", "Event", "Placement"];

export default function AnnouncementTabs() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredAnnouncements = MOCK_ANNOUNCEMENTS.filter(
    (ann) => activeTab === "All" || ann.type === activeTab
  );

  return (
    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl">
      <div className="p-6 pb-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Announcements
        </h2>
        
        {/* Custom Tabs */}
        <div className="flex bg-black/20 p-1 rounded-2xl overflow-x-auto w-full sm:w-auto hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-colors whitespace-nowrap z-10 ${
                activeTab === tab ? "text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white/10 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {filteredAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <motion.div
                  key={announcement.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-black/30 text-muted-foreground uppercase tracking-wider">
                      {announcement.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{announcement.date}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-brand-400 transition-colors">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {announcement.content}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center text-muted-foreground"
            >
              No announcements in this category.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
