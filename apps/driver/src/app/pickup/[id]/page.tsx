'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Phone, MapPin, Minus, Plus, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function PickupDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [orderNumber, setOrderNumber] = useState('ORD-001');
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [address, setAddress] = useState('123, Mansarovar, Jaipur - 302020');
  const [expectedItems, setExpectedItems] = useState(8);
  const [collectedItems, setCollectedItems] = useState(8);
  const [otp, setOtp] = useState(['1', '2', '3', '4']);
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const nextOtp = [...otp];
    nextOtp[index] = val.slice(-1);
    setOtp(nextOtp);
    if (val && index < 3) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleConfirmPickup = () => {
    if (otp.some(d => !d)) {
      toast.error('Please enter customer 4-digit OTP');
      return;
    }
    setIsCompleted(true);
    toast.success('Pickup verified and recorded successfully!');
  };

  // Screen 5: Job Completed (Pickup Completed)
  if (isCompleted) {
    return (
      <div className="flex-1 flex flex-col bg-white min-h-screen">


        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          {/* Large Green Checkmark Circle */}
          <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/25 mb-6">
            <CheckCircle2 className="w-14 h-14 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Pickup Completed!
          </h2>

          <p className="text-sm font-bold text-slate-700 font-mono mb-1">
            {orderNumber}
          </p>

          <p className="text-xs text-slate-400 font-medium mb-10">
            10:42 AM | {collectedItems} Items
          </p>

          <div className="w-full space-y-3 max-w-xs">
            <button
              onClick={() => router.push('/jobs')}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              View Next Job
            </button>

            <button
              onClick={() => router.push('/jobs')}
              className="w-full py-3.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm active:scale-95 transition-all"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Screen 3: Pickup Details
  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen">


      {/* Header */}
      <header className="px-5 pt-2 pb-3 border-b border-slate-100 flex items-center gap-3">
        <Link
          href="/jobs"
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-base font-extrabold text-slate-900 leading-tight">Pickup Details</h1>
          <p className="text-[11px] font-bold text-slate-400 font-mono">{orderNumber}</p>
        </div>
      </header>

      <div className="flex-1 p-5 space-y-5 overflow-y-auto">
        {/* Customer Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
              {customerName[0]}
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Customer</p>
              <h2 className="text-sm font-extrabold text-slate-900">{customerName}</h2>
              <p className="text-xs text-slate-500 font-medium">{mobile}</p>
            </div>
          </div>
          <a
            href={`tel:${mobile}`}
            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Address */}
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Address</p>
          <div className="flex items-start gap-2 text-xs text-slate-700 font-medium">
            <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <span>{address}</span>
          </div>
        </div>

        {/* Expected vs Collected Items */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Expected Items</span>
            <span className="font-bold text-slate-900">{expectedItems}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Collected Items</span>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5">
              <button
                onClick={() => setCollectedItems(Math.max(1, collectedItems - 1))}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 active:scale-90 transition-all"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-extrabold text-sm text-slate-900">{collectedItems}</span>
              <button
                onClick={() => setCollectedItems(collectedItems + 1)}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 active:scale-90 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Customer OTP */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Customer OTP</label>
          <div className="flex justify-between gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                className="flex-1 h-14 text-center text-xl font-bold rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
              />
            ))}
          </div>
        </div>

        {/* Notes (Optional) */}
        <div className="space-y-1.5 pt-2">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes (optional)"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Fixed Confirm Pickup Button */}
      <div className="p-5 border-t border-slate-100">
        <button
          onClick={handleConfirmPickup}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all text-center"
        >
          Confirm Pickup
        </button>
      </div>
    </div>
  );
}
