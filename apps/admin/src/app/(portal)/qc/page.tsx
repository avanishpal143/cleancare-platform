'use client';

import { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, RotateCcw } from 'lucide-react';

export default function QCPage() {
  const [qcQueue, setQcQueue] = useState([
    { id: '1', orderNumber: 'ORD-004', customer: 'Neha Jain', items: 12, service: 'Special Care', inspector: 'Manoj', status: 'PENDING' },
    { id: '2', orderNumber: 'ORD-009', customer: 'Deepak Joshi', items: 5, service: 'Dry Cleaning', inspector: 'Manoj', status: 'PENDING' },
    { id: '3', orderNumber: 'ORD-011', customer: 'Ananya Roy', items: 9, service: 'Laundry & Press', inspector: 'Suresh P', status: 'PENDING' },
  ]);

  const markQC = (id: string, result: 'PASSED' | 'FAILED') => {
    setQcQueue(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quality Control (QC)</h1>
        <p className="text-xs text-slate-500 mt-1">Inspect processed garments, verify stain removal and finish before packing</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <p className="text-xs text-slate-500 font-semibold">QC Pending</p>
          <p className="text-2xl font-black text-amber-600 mt-1">12 Orders</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <p className="text-xs text-slate-500 font-semibold">Passed Today</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">45 Orders</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <p className="text-xs text-slate-500 font-semibold">Reprocessing / Failed</p>
          <p className="text-2xl font-black text-rose-500 mt-1">2 Orders</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">Pending Inspection Roster</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">Order #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Items</th>
                <th className="px-6 py-3.5">Service</th>
                <th className="px-6 py-3.5">Inspector</th>
                <th className="px-6 py-3.5 text-right">Inspection Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {qcQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-bold font-mono text-blue-700">{item.orderNumber}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800">{item.customer}</td>
                  <td className="px-6 py-3.5 text-slate-600 font-medium">{item.items} items</td>
                  <td className="px-6 py-3.5 text-slate-600">{item.service}</td>
                  <td className="px-6 py-3.5 text-slate-500">{item.inspector}</td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => markQC(item.id, 'PASSED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass & Pack
                      </button>
                      <button
                        onClick={() => markQC(item.id, 'FAILED')}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reprocess
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
