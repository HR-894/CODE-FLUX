import { ArrowLeft, FileBadge } from "lucide-react";
import Link from "next/link";

export default function CertificatesPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 h-[80vh] flex flex-col items-center justify-center text-center">
      <FileBadge className="w-24 h-24 text-brand-500/50 mb-4" />
      <h1 className="text-4xl font-bold tracking-tight">Certificates</h1>
      <p className="text-muted-foreground max-w-md text-lg">
        This module is currently under construction for the CampusOS Hackathon Demo.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-medium rounded-2xl transition-all shadow-lg shadow-brand-500/20 inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
