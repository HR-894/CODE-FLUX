"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, CheckCircle2, XCircle } from "lucide-react";
import AttendanceChart from "./AttendanceChart";

interface CourseDetailCardProps {
  course: {
    id: string;
    title: string;
    code: string;
    attendance: number;
    totalClasses: number;
    attended: number;
    type: string;
    faculty: string;
    credits: number;
  };
  details: { date: string; time: string; status: string; type: string }[];
  idx: number;
}

export default function CourseDetailCard({ course, details, idx }: CourseDetailCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.1 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col xl:flex-row gap-8 shadow-2xl hover:bg-white/10 transition-colors"
    >
      {/* Course Header & Attendance Ring */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full xl:w-1/3">
        <AttendanceChart percentage={course.attendance} size={100} strokeWidth={8} />
        
        <div className="text-center sm:text-left">
          <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
            <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider">
              {course.code}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {course.credits} Credits
            </span>
          </div>
          <h3 className="text-xl font-bold mb-1">{course.title}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 justify-center sm:justify-start">
            <GraduationCap className="w-4 h-4" />
            {course.faculty}
          </p>
          <div className="mt-4 flex gap-4 justify-center sm:justify-start text-sm">
            <div>
              <p className="text-muted-foreground">Total</p>
              <p className="font-semibold">{course.totalClasses}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Attended</p>
              <p className="font-semibold text-green-400">{course.attended}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Missed</p>
              <p className="font-semibold text-red-400">{course.totalClasses - course.attended}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Attendance List */}
      <div className="flex-1 w-full bg-black/20 rounded-2xl p-4 overflow-hidden flex flex-col">
        <h4 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Recent Lectures
        </h4>
        
        <div className="overflow-y-auto max-h-[160px] pr-2 space-y-2 custom-scrollbar">
          {details?.length > 0 ? (
            details.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${log.status === 'Present' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {log.status === 'Present' ? (
                      <CheckCircle2 className={`w-4 h-4 text-green-500`} />
                    ) : (
                      <XCircle className={`w-4 h-4 text-red-500`} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{log.date}</p>
                    <p className="text-xs text-muted-foreground">{log.time} • {log.type}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${log.status === 'Present' ? 'text-green-500' : 'text-red-500'}`}>
                  {log.status}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-4">
              No recent attendance records available.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
