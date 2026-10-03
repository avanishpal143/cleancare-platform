'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

type Period = 'Daily' | 'Weekly' | 'Monthly';

export default function EarningsPage() {
  const [period, setPeriod] = useState<Period>('Daily');
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  const dates = ['22 Sep 2026', '21 Sep 2026', '20 Sep 2026'];
  const currentDate = dates[currentDateIndex] || '22 Sep 2026';

  const earningsByPeriod: Record<Period, { total: string; jobs: number; pickups: number; deliveries: number }> = {
    Daily: { total: '1,240', jobs: 8, pickups: 5, deliveries: 3 },
    Weekly: { total: '7,860', jobs: 48, pickups: 28, deliveries: 20 },
    Monthly: { total: '32,450', jobs: 196, pickups: 112, deliveries: 84 },
  };

  const currentStats = earningsByPeriod[period];

  const recentJobs = [
    { id: 'ORD-001', type: 'Pickup', time: '10:42 AM', status: 'Completed', amount: '₹0', isPickup: true },
    { id: 'ORD-002', type: 'Delivery', time: '01:20 PM', status: 'Completed', amount: '₹860', isPickup: false },
    { id: 'ORD-003', type: 'Pickup', time: '03:10 PM', status: 'Completed', amount: '₹0', isPickup: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen">

      {/* Header */}
      <header className="px-5 pt-2 pb-3 border-b border-slate-100 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-extrabold text-slate-900 leading-tight">Earnings</h1>
      </header>

      <div className="flex-1 p-5 space-y-4 overflow-y-auto">
        {/* Period Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {(['Daily', 'Weekly', 'Monthly'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={clsx(
                'flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center',
                period === p
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Date Switcher */}
        <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-slate-700">
          <button
            onClick={() => setCurrentDateIndex(Math.min(dates.length - 1, currentDateIndex + 1))}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>{currentDate}</span>
          <button
            onClick={() => setCurrentDateIndex(Math.max(0, currentDateIndex - 1))}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left">
          <p className="text-xs font-semibold text-slate-400 mb-1">Total Earnings</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            ₹{currentStats.total}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 font-medium">Jobs Completed: </span>
              <span className="font-bold text-slate-800">{currentStats.jobs}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="text-blue-600">Pickups: {currentStats.pickups}</span>
              <span className="text-amber-600">Deliveries: {currentStats.deliveries}</span>
            </div>
          </div>
        </div>

        {/* Recent Jobs Section */}
        <div className="space-y-2.5 pt-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Jobs</h2>

          <div className="space-y-2">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={clsx(
                      'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold',
                      job.isPickup ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    )}
                  >
                    {job.isPickup ? <Package className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">{job.id}</p>
                      <span className="text-[10px] text-slate-400">· {job.type}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600">
                      {job.status}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{job.amount}</p>
                  <p className="text-[10px] text-slate-400">{job.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
