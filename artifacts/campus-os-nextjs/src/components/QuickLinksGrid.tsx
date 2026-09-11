"use client";

import { motion } from "framer-motion";
import { LifeBuoy, GraduationCap, Receipt, Tent, Calendar, FileBadge, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import TiltCard from "./TiltCard";

const EXTENDED_QUICK_LINKS = [
  { id: 1, title: "RMS", desc: "Complaints & Suggestions", icon: LifeBuoy, color: "bg-blue-500/10 text-blue-400 border-blue-500/20", href: "/rms" },
  { id: 2, title: "Fee Statement", desc: "Manage Payments", icon: Receipt, color: "bg-green-500/10 text-green-400 border-green-500/20", href: "/fee" },
  { id: 3, title: "Edu Revolution", desc: "Online Learning", icon: GraduationCap, color: "bg-purple-500/10 text-purple-400 border-purple-500/20", href: "/edu-rev" },
  { id: 4, title: "Hostel Leave", desc: "Gate Pass", icon: Tent, color: "bg-amber-500/10 text-amber-400 border-amber-500/20", isAction: true },
  { id: 5, title: "Academic Calendar", desc: "Session Dates", icon: Calendar, color: "bg-brand-500/10 text-brand-400 border-brand-500/20", href: "/calendar" },
  { id: 6, title: "Certificates", desc: "Request Documents", icon: FileBadge, color: "bg-pink-500/10 text-pink-400 border-pink-500/20", href: "/certificates" },
];

export default function QuickLinksGrid({ onOpenLeaveSheet }: { onOpenLeaveSheet?: () => void }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {EXTENDED_QUICK_LINKS.map((link, idx) => {
        const Icon = link.icon;
        
        const CardContent = (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-xl h-full flex flex-col justify-between group`}
          >
            <div className={`p-3 rounded-2xl w-fit mb-4 border ${link.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-brand-400 transition-colors flex items-center justify-between">
                {link.title}
                <LinkIcon className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{link.desc}</p>
            </div>
          </motion.div>
        );

        return (
          <TiltCard key={link.id}>
            {link.isAction ? (
              <button onClick={onOpenLeaveSheet} className="block h-full w-full text-left">
                {CardContent}
              </button>
            ) : (
              <Link href={link.href || "#"} className="block h-full">
                {CardContent}
              </Link>
            )}
          </TiltCard>
        );
      })}
    </div>
  );
}
