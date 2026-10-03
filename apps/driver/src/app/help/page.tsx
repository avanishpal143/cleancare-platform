'use client';

import { ChevronLeft, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function DriverHelpPage() {
  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen">


      <header className="px-5 pt-2 pb-3 border-b border-slate-100 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-extrabold text-slate-900 leading-tight">Help & Support</h1>
      </header>

      <div className="flex-1 p-5 space-y-4">
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <h2 className="font-bold text-blue-900 text-sm mb-1">Dispatcher Hotline</h2>
          <p className="text-xs text-blue-700 mb-3">Reach out immediately for customer address issues or bag count discrepancies.</p>
          <a
            href="tel:+919800000002"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            <Phone className="w-3.5 h-3.5" /> Call Operations (+91 98000 00002)
          </a>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Driver FAQs</h3>
          <details className="text-xs text-slate-600 border-b border-slate-100 pb-2">
            <summary className="font-semibold text-slate-800 cursor-pointer">Customer not sharing OTP?</summary>
            <p className="mt-1 text-slate-500">Call customer directly or inform Operations Manager to verify order pickup.</p>
          </details>
          <details className="text-xs text-slate-600 border-b border-slate-100 pb-2">
            <summary className="font-semibold text-slate-800 cursor-pointer">Garment count mismatch?</summary>
            <p className="mt-1 text-slate-500">Update the collected counter on screen. An automatic exception report is generated for QC.</p>
          </details>
          <details className="text-xs text-slate-600">
            <summary className="font-semibold text-slate-800 cursor-pointer">Customer wants to change delivery time?</summary>
            <p className="mt-1 text-slate-500">Customer can reschedule directly from their app or contact support.</p>
          </details>
        </div>
      </div>
    </div>
  );
}
