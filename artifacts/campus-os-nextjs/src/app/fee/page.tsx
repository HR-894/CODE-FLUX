import FeeStatementTable from "@/components/FeeStatementTable";
import PaymentDrawer from "@/components/PaymentDrawer";
import { ArrowLeft, Bell, Wallet } from "lucide-react";
import Link from "next/link";

export default function FeeDashboardPage() {
  const pendingAmount = 127500; // Tuition + Exam fee from mock data

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
          <h1 className="text-4xl font-bold tracking-tight">Fee Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your academic and hostel fee payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-brand-400">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Outstanding Balance */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-900 p-8 text-white shadow-2xl shadow-brand-900/20">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <p className="text-brand-100 font-medium mb-2">Total Outstanding Balance</p>
            <h2 className="text-5xl font-bold mb-6">₹{pendingAmount.toLocaleString("en-IN")}</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <PaymentDrawer amount={pendingAmount} description="Full Semester Fee" />
            </div>
          </div>
        </div>

        {/* Next Due Date & Break down */}
        <div className="rounded-3xl bg-white/5 p-8 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <p className="text-muted-foreground font-medium mb-1">Next Payment Due</p>
            <h3 className="text-2xl font-semibold mb-6">10th January 2024</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-foreground">Tuition Fee (Spring 2024)</span>
                <span className="font-medium">₹1,25,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">Examination Fee</span>
                <span className="font-medium">₹2,500</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
            <span className="text-muted-foreground font-medium">Total</span>
            <span className="text-xl font-bold text-brand-400">₹{pendingAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Statement Table */}
      <FeeStatementTable />
    </div>
  );
}
