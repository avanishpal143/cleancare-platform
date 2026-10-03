'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function OrderSummaryPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [loading, setLoading] = useState(false);

  const items = [
    { name: 'Shirt (2)', amount: 120 },
    { name: 'Trouser (1)', amount: 70 },
    { name: 'Saree (1)', amount: 120 },
  ];

  const handleConfirmOrder = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Order ORD-20260922-001 Confirmed!');
      router.push('/orders/ORD-20260922-001');
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col justify-between bg-white h-full p-4 sm:p-6 overflow-hidden select-none"
    >
      {/* ── Top Header (Matching Screen 6) ──────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 pb-3 border-b border-slate-100">
        <Link
          href="/book/pickup"
          className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors border border-slate-100 shadow-xs"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            Order Summary
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Verify bill & choose payment</p>
        </div>
      </div>

      {/* ── Middle: Itemized Bill & Payment Method (Matching Screen 6) ───── */}
      <div className="flex-1 overflow-y-auto my-auto space-y-3.5 py-2">
        {/* Garments items */}
        <div className="space-y-2.5">
          {items.map((item) => (
            <div key={item.name} className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-800">{item.name}</span>
              <span className="text-slate-900 font-black">₹{item.amount}</span>
            </div>
          ))}
        </div>

        {/* Charges breakdown */}
        <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500 font-medium">
            <span>Service Charges</span>
            <span className="font-bold text-slate-800">₹310</span>
          </div>

          <div className="flex justify-between text-slate-500 font-medium">
            <span>Delivery Charge</span>
            <span className="font-bold text-slate-800">₹50</span>
          </div>

          <div className="flex justify-between text-slate-500 font-medium">
            <span>Tax (18%)</span>
            <span className="font-bold text-slate-800">₹65</span>
          </div>
        </div>

        {/* Total Amount Row */}
        <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between">
          <span className="text-base font-black text-slate-900">Total Amount</span>
          <span className="text-2xl font-black text-slate-900">₹425</span>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <p className="text-xs font-black text-slate-700">Payment Method</p>

          <div className="space-y-2">
            {/* Online Payment */}
            <div
              onClick={() => setPaymentMethod('ONLINE')}
              className={clsx(
                'p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 select-none',
                paymentMethod === 'ONLINE' ? 'border-blue-600 bg-blue-50/50 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
              )}
            >
              <div
                className={clsx(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                  paymentMethod === 'ONLINE' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                )}
              >
                {paymentMethod === 'ONLINE' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="text-xs font-bold text-slate-900">Online Payment (UPI/Card)</span>
            </div>

            {/* Cash on Delivery */}
            <div
              onClick={() => setPaymentMethod('COD')}
              className={clsx(
                'p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 select-none',
                paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50/50 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
              )}
            >
              <div
                className={clsx(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                  paymentMethod === 'COD' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                )}
              >
                {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom: Confirm Order Button (Cleanly docked) ────────────────── */}
      <div className="shrink-0 pt-3 pb-1 border-t border-slate-100">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleConfirmOrder}
          disabled={loading}
          className="w-full py-3.5 sm:py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all text-center flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Order'}
        </motion.button>
      </div>
    </motion.div>
  );
}
