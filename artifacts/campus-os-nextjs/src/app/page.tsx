"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  BellRing,
  ChevronRight,
  Circle,
  CalendarDays
} from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { LeaveRequestSheet } from "@/components/ActionSheet";
import ThemeToggle from "@/components/ThemeToggle";
import { MOCK_COURSES, MOCK_ASSIGNMENTS, MOCK_TIMETABLE } from "@/lib/mock-data";
import QuickLinksGrid from "@/components/QuickLinksGrid";
import AnnouncementTabs from "@/components/AnnouncementTabs";
import Link from "next/link";
import TiltCard from "@/components/TiltCard";

// --- Physics & Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export default function BentoBoxDashboard() {
  const [leaveSheetOpen, setLeaveSheetOpen] = useState(false);

  return (
    <main className="min-h-screen p-4 md:p-8 font-sans max-w-[1400px] mx-auto">
      
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-amber-500 drop-shadow-sm">
            CampusOS
          </h1>
          <p className="text-foreground/60 font-medium mt-1">LPU · Dashboard</p>
        </div>
        <div className="flex gap-3">
          <ThemeToggle />
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-panel-bg backdrop-blur-md rounded-full border border-panel-border text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors shadow-sm"
          >
            <BellRing size={20} />
          </motion.button>
        </div>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-5"
      >
        {/* LEFT COLUMN: Important Links & Announcements */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Quick Links Grid */}
          <div>
            <h2 className="text-lg font-bold mb-4 px-2">Important Links</h2>
            <QuickLinksGrid onOpenLeaveSheet={() => setLeaveSheetOpen(true)} />
          </div>

          {/* Announcements Tabs */}
          <div className="flex-1 min-h-[400px]">
             <AnnouncementTabs />
          </div>
        </div>

        {/* RIGHT COLUMN: Academics, Timetable, Assignments */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Attendance / Courses (Link to Academics Page) */}
          <TiltCard className="h-[280px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-foreground/90 font-bold tracking-tight">My Courses</h2>
              <Link href="/academics">
                <ChevronRight className="text-foreground/40 hover:text-brand-500 transition-colors cursor-pointer" size={20} />
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {MOCK_COURSES.map(course => (
                <Link href="/academics" key={course.id}>
                  <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all duration-300 ease-out group mb-3 last:mb-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-brand-500">{course.code}</span>
                      </div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-brand-500 transition-colors">{course.title}</div>
                      <div className="text-[10px] text-foreground/40 mt-1 font-medium">Attended: {course.attended}/{course.totalClasses}</div>
                    </div>
                    <div className="w-12 h-12 shrink-0 drop-shadow-sm">
                      <CircularProgressbar 
                        value={course.attendance} 
                        text={`${course.attendance}%`} 
                        styles={buildStyles({
                          pathColor: course.attendance >= 75 ? '#22c55e' : '#ef4444',
                          textColor: course.attendance >= 75 ? '#22c55e' : '#ef4444',
                          trailColor: 'rgba(150, 150, 150, 0.1)',
                          textSize: '28px',
                          pathTransitionDuration: 1.5,
                        })}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TiltCard>

          {/* Timetable */}
          <TiltCard className="border-brand-500/30 bg-gradient-to-b from-brand-500/10 to-transparent min-h-[250px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-brand-500">
                <CalendarDays size={20} />
                <h2 className="text-lg font-bold">Today&apos;s Schedule</h2>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-0 overflow-y-auto custom-scrollbar pr-2 relative">
              <div className="absolute left-3 top-2 bottom-2 w-px bg-brand-500/20" />
              {MOCK_TIMETABLE.map((item) => (
                <div key={item.id} className="relative pl-8 pb-6 last:pb-0 group cursor-default">
                  <div className={`absolute left-[-2.5px] top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-panel-bg transition-colors duration-500 ${item.current ? 'border-brand-500' : 'border-brand-500/40'}`}>
                    {item.current && <div className="absolute inset-0.5 bg-brand-500 rounded-full animate-pulse" />}
                  </div>
                  <div className="text-[10px] font-bold text-foreground/50 mb-0.5 uppercase tracking-wider">{item.time} - {item.endTime}</div>
                  <div className={`text-sm font-bold mb-1 transition-colors duration-300 ${item.current ? "text-brand-500" : "text-foreground/80 group-hover:text-foreground"}`}>
                    {item.title}
                  </div>
                  {item.location && (
                    <div className="flex items-center gap-1.5 text-xs text-foreground/50 mb-1">
                      <MapPin size={12} /> {item.location}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TiltCard>

          {/* Pending Assignments */}
          <TiltCard className="min-h-[200px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-foreground/90 font-bold tracking-tight">Assignments</h2>
              <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider">2 Pending</span>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
              {MOCK_ASSIGNMENTS.map(assign => (
                <div key={assign.id} className="group flex gap-3 cursor-pointer p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors duration-300 ease-out">
                  <Circle size={16} className="text-foreground/30 mt-0.5 group-hover:text-brand-500 transition-colors flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-foreground/90 group-hover:text-brand-500 transition-colors leading-tight mb-1">{assign.title}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-foreground/50 bg-foreground/5 px-1.5 py-0.5 rounded">{assign.course}</span>
                      <span className="text-[10px] text-foreground/50">{assign.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>

        </div>
      </motion.div>

      <LeaveRequestSheet isOpen={leaveSheetOpen} setOpen={setLeaveSheetOpen} />
    </main>
  );
}
