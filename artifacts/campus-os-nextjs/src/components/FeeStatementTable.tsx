"use client";

import { motion } from "framer-motion";
import { Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { MOCK_FEE_TRANSACTIONS } from "@/lib/mock-data";

export default function FeeStatementTable() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white/5 p-6 backdrop-blur-xl border border-white/10 shadow-2xl">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-foreground">
        <ReceiptIcon className="w-5 h-5 text-brand-500" />
        Transaction History
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-sm font-medium text-muted-foreground">
              <th className="pb-3 pr-4">Transaction ID</th>
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">Semester</th>
              <th className="pb-3 pr-4 text-right">Amount</th>
              <th className="pb-3 pl-4">Status</th>
              <th className="pb-3 pl-4">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_FEE_TRANSACTIONS.map((txn, idx) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={txn.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 pr-4 text-sm font-mono">{txn.id}</td>
                <td className="py-4 pr-4 text-sm whitespace-nowrap">{txn.date}</td>
                <td className="py-4 pr-4 text-sm font-medium">{txn.type}</td>
                <td className="py-4 pr-4 text-sm text-muted-foreground">{txn.semester}</td>
                <td className="py-4 pr-4 text-sm text-right font-semibold">
                  ₹{txn.amount.toLocaleString("en-IN")}
                </td>
                <td className="py-4 pl-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      txn.status === "Paid"
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    }`}
                  >
                    {txn.status === "Paid" ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}
                    {txn.status}
                  </span>
                </td>
                <td className="py-4 pl-4">
                  {txn.receiptUrl ? (
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-blue-500 hover:text-blue-400">
                      <Download className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground px-2">—</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReceiptIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </svg>
  );
}
