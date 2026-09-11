import CourseDetailCard from "@/components/CourseDetailCard";
import { MOCK_COURSES, MOCK_DETAILED_ATTENDANCE } from "@/lib/mock-data";
import { ArrowLeft, Bell, BookMarked } from "lucide-react";
import Link from "next/link";

export default function AcademicsPage() {
  // Calculate total attendance across all courses
  const totalClasses = MOCK_COURSES.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const totalAttended = MOCK_COURSES.reduce((acc, curr) => acc + curr.attended, 0);
  const overallPercentage = Math.round((totalAttended / totalClasses) * 100);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">Academics Overview</h1>
          <p className="text-muted-foreground mt-2">Detailed view of your registered courses and attendance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-brand-400">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-white/5 p-6 border border-white/10 backdrop-blur-xl">
          <p className="text-muted-foreground font-medium mb-1 flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-brand-400" />
            Registered Courses
          </p>
          <p className="text-4xl font-bold mt-2">{MOCK_COURSES.length}</p>
        </div>
        <div className="rounded-3xl bg-white/5 p-6 border border-white/10 backdrop-blur-xl">
          <p className="text-muted-foreground font-medium mb-1 text-green-400">Total Attended</p>
          <p className="text-4xl font-bold mt-2">{totalAttended} <span className="text-lg text-muted-foreground font-medium">/ {totalClasses}</span></p>
        </div>
        <div className={`rounded-3xl p-6 border backdrop-blur-xl ${overallPercentage < 75 ? 'bg-red-500/10 border-red-500/20' : 'bg-brand-500/10 border-brand-500/20'}`}>
          <p className={`font-medium mb-1 ${overallPercentage < 75 ? 'text-red-400' : 'text-brand-400'}`}>Aggregate Attendance</p>
          <p className="text-4xl font-bold mt-2">{overallPercentage}%</p>
          {overallPercentage < 75 && (
            <p className="text-xs text-red-400 mt-2 font-medium">Warning: Below 75% threshold.</p>
          )}
        </div>
      </div>

      {/* Detailed Courses */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Course Breakdown</h2>
        <div className="grid gap-6">
          {MOCK_COURSES.map((course, idx) => (
            <CourseDetailCard 
              key={course.id} 
              course={course} 
              // @ts-expect-error Types for mock data
              details={MOCK_DETAILED_ATTENDANCE[course.code] || []} 
              idx={idx} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
