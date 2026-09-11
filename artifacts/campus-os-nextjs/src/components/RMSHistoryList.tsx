"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { MOCK_RMS_COMPLAINTS } from "@/lib/mock-data";

export default function RMSHistoryList() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-foreground">
        <Clock className="w-5 h-5 text-brand-500" />
        Previous Complaints & Suggestions
      </h3>
      
      <div className="grid gap-4">
        {MOCK_RMS_COMPLAINTS.map((complaint, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={complaint.id}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row gap-6 justify-between hover:bg-white/10 transition-colors group"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-sm text-brand-400">{complaint.id}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-sm font-medium">{complaint.category}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{complaint.subCategory}</span>
              </div>
              <p className="text-foreground leading-relaxed">{complaint.description}</p>
              
              {complaint.resolution && (
                <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-sm">
                  <span className="font-semibold text-brand-400 mb-1 block">Resolution:</span>
                  <span className="text-muted-foreground">{complaint.resolution}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-start sm:items-end gap-3 min-w-[140px]">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  complaint.status === "Resolved"
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : complaint.status === "In Progress"
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}
              >
                {complaint.status === "Resolved" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : complaint.status === "In Progress" ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                {complaint.status}
              </span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Updated {complaint.lastUpdated}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
