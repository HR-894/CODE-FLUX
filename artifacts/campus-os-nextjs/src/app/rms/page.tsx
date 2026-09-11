import RMSHistoryList from "@/components/RMSHistoryList";
import RMSNewTicketForm from "@/components/RMSNewTicketForm";
import { ArrowLeft, Bell, LifeBuoy } from "lucide-react";
import Link from "next/link";

export default function RMSDashboardPage() {
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
          <h1 className="text-4xl font-bold tracking-tight">Relationship Management System</h1>
          <p className="text-muted-foreground mt-2">Log and track your complaints, suggestions, and queries.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-brand-400">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-900 p-8 sm:p-12 text-white shadow-2xl shadow-brand-900/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <LifeBuoy className="w-48 h-48 sm:w-64 sm:h-64 translate-x-8 -translate-y-8" />
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-bold mb-4">How can we help you today?</h2>
          <p className="text-brand-100 mb-8 leading-relaxed">
            Whether it&apos;s a plumbing issue in your hostel room or a discrepancy in your attendance, 
            log a request here and our dedicated teams will resolve it.
          </p>
          <RMSNewTicketForm />
        </div>
        
        {/* Quick Stats */}
        <div className="relative z-10 flex gap-4 w-full sm:w-auto overflow-x-auto pb-4 sm:pb-0 hide-scrollbar">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 min-w-[140px]">
            <p className="text-brand-100 font-medium mb-1">Pending</p>
            <p className="text-4xl font-bold">1</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 min-w-[140px]">
            <p className="text-brand-100 font-medium mb-1">Resolved</p>
            <p className="text-4xl font-bold">1</p>
          </div>
        </div>
      </div>

      {/* History List */}
      <RMSHistoryList />
    </div>
  );
}
