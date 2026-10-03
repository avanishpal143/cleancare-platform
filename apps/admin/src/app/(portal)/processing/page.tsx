'use client';

import { useState } from 'react';
import { Layers, CheckCircle2, Clock, AlertCircle, Search, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

export default function ProcessingPage() {
  const [stages, setStages] = useState([
    { id: '1', orderNumber: 'ORD-001', customer: 'Rahul Sharma', garments: 8, stage: 'WASHING', tagId: 'TAG-8821', timeIn: '10:45 AM' },
    { id: '2', orderNumber: 'ORD-003', customer: 'Amit Verma', garments: 6, stage: 'DRYING', tagId: 'TAG-8819', timeIn: '09:20 AM' },
    { id: '3', orderNumber: 'ORD-007', customer: 'Vikas Gupta', garments: 11, stage: 'SORTING', tagId: 'TAG-8824', timeIn: '11:10 AM' },
    { id: '4', orderNumber: 'ORD-008', customer: 'Sunita Rao', garments: 4, stage: 'IRONING', tagId: 'TAG-8815', timeIn: '08:50 AM' },
  ]);

  const advanceStage = (id: string) => {
    const nextMap: Record<string, string> = {
      SORTING: 'WASHING',
      WASHING: 'DRYING',
      DRYING: 'IRONING',
      IRONING: 'READY_FOR_QC',
    };
    setStages(prev => prev.map(item => item.id === id ? { ...item, stage: nextMap[item.stage] || 'READY_FOR_QC' } : item));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Processing Center</h1>
        <p className="text-xs text-slate-500 mt-1">Live tracking of sorting, washing, drying, and steam press workflows</p>
      </div>

      {/* Stage counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Sorting & Tagging', count: 7, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'In Washing Machine', count: 18, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { label: 'Drying Cycle', count: 12, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Steam Ironing', count: 9, color: 'text-teal-600 bg-teal-50 border-teal-100' },
        ].map((item) => (
          <div key={item.label} className={clsx('p-4 rounded-2xl border', item.color)}>
            <p className="text-xs font-semibold">{item.label}</p>
            <p className="text-2xl font-black mt-1">{item.count}</p>
          </div>
        ))}
      </div>

      {/* Processing Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Active Center Queue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">Order #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Items</th>
                <th className="px-6 py-3.5">Tag ID</th>
                <th className="px-6 py-3.5">Current Stage</th>
                <th className="px-6 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stages.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-bold font-mono text-blue-700">{row.orderNumber}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800">{row.customer}</td>
                  <td className="px-6 py-3.5 text-slate-600 font-medium">{row.garments} pcs</td>
                  <td className="px-6 py-3.5 font-mono text-[11px] text-slate-500">{row.tagId}</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {row.stage.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => advanceStage(row.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      Advance <ArrowRight className="w-3 h-3" />
                    </button>
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
