'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, Check, Download, X, Phone, Truck,
  ShieldCheck, MapPin, Calendar, Clock, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

interface TimelineStep {
  label: string;
  time?: string;
  completed: boolean;
  active?: boolean;
}

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const orderNumber = id === 'ORD-20260922-001' ? 'ORD-20260922-001' : (id || 'ORD-20260922-001');

  // Exact timeline matching reference image Screen 7
  const timeline: TimelineStep[] = [
    { label: 'Booked', time: '22 Sep, 10:30 AM', completed: true },
    { label: 'Pickup Assigned', time: '22 Sep, 11:00 AM', completed: true },
    { label: 'Picked Up', time: '22 Sep, 01:20 PM', completed: true },
    { label: 'Received at Center', time: '22 Sep, 03:15 PM', completed: true },
    { label: 'Processing (Ozone Wash)', time: '23 Sep, 10:00 AM', completed: true, active: true },
    { label: 'Quality Check (QC)', completed: false },
    { label: 'Packed on Hangers', completed: false },
    { label: 'Out for Delivery', completed: false },
    { label: 'Delivered to Doorstep', completed: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Order Tracking
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Real-time garment progress & delivery tracking
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInvoiceModal(true)}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>View Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timeline & Live Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Meta Card */}
          <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-base font-black text-slate-900">
                  {orderNumber}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  In Processing
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                12 Items • ₹1,240 Total • Online Prepaid
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Expected Delivery: 24 Sep 2026, 6:00 PM</span>
            </div>
          </div>

          {/* Vertical Timeline */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              Lifecycle Progress
            </h3>

            <div className="space-y-0 pl-2">
              {timeline.map((step, idx) => {
                const isLast = idx === timeline.length - 1;
                return (
                  <div key={step.label} className="flex gap-4">
                    {/* Step Circle & Connector */}
                    <div className="flex flex-col items-center">
                      <div
                        className={clsx(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all shadow-xs',
                          step.active
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                            : step.completed
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-slate-200 bg-white text-transparent'
                        )}
                      >
                        {step.completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                      </div>

                      {!isLast && (
                        <div
                          className={clsx(
                            'w-0.5 min-h-[38px] my-1',
                            step.completed && !timeline[idx + 1]?.active && timeline[idx + 1]?.completed
                              ? 'bg-emerald-600'
                              : step.active
                              ? 'bg-gradient-to-b from-blue-600 to-slate-200'
                              : 'bg-slate-200'
                          )}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-5">
                      <p
                        className={clsx(
                          'text-sm font-bold leading-none',
                          step.active ? 'text-blue-600 font-black' : step.completed ? 'text-slate-900' : 'text-slate-400'
                        )}
                      >
                        {step.label}
                      </p>
                      {step.time && (
                        <p className="text-xs text-slate-400 font-medium mt-1">
                          {step.time}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Assigned Driver & Help Box */}
        <div className="space-y-5">
          {/* Driver Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Assigned Delivery Partner</span>
            </h3>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                R
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-tight">Rakesh Meena</p>
                <p className="text-xs text-slate-400 mt-0.5">CleanCare Express Partner</p>
                <p className="text-[11px] font-bold text-emerald-600 mt-0.5">★ 4.9 (420+ trips)</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Vehicle:</span>
                <span className="font-bold text-slate-800">CleanCare Van (RJ-14-CC-1024)</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>OTP Verification:</span>
                <span className="font-bold text-blue-600 font-mono">Required at Delivery</span>
              </div>
            </div>

            <a
              href="tel:+919876500010"
              className="w-full py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors border border-blue-100"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Partner (+91 98765 00010)</span>
            </a>
          </div>

          {/* Need Help Box */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900">Need Immediate Help?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Have questions regarding garment fabric or schedule changes? Our operations team is on call.
            </p>
            <button
              onClick={() => alert('Support helpline: +91 98765 43210 (24x7)')}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
            >
              Contact Support Hotline
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Modal Preview */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Tax Invoice</h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice No:</span>
                <span className="font-bold text-slate-800 font-mono">INV-2026-0922</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-bold text-slate-800 font-mono">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="font-semibold text-slate-800">Satyanarayan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Address:</span>
                <span className="font-semibold text-slate-800">Mansarovar, Jaipur</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Items (12 garments)</span>
                <span>₹1,000</span>
              </div>
              <div className="flex justify-between">
                <span>Service & Pickup</span>
                <span>₹50</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹190</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
                <span>Total Paid</span>
                <span>₹1,240</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Downloading invoice PDF...');
                setShowInvoiceModal(false);
              }}
              className="w-full py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 mt-4 shadow-md shadow-blue-500/25 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
