'use client';

import { useState } from 'react';
import { CreditCard, ArrowDownLeft, CheckCircle2, Clock } from 'lucide-react';

export default function PaymentsPage() {
  const [payments] = useState([
    { id: 'TXN-9021', orderNumber: 'ORD-001', customer: 'Rahul Sharma', amount: 1240, method: 'UPI (GPay)', status: 'PAID', date: '22 Sep 10:32 AM' },
    { id: 'TXN-9020', orderNumber: 'ORD-002', customer: 'Priya Singh', amount: 860, method: 'COD (Pending)', status: 'PENDING', date: '22 Sep 09:18 AM' },
    { id: 'TXN-9019', orderNumber: 'ORD-003', customer: 'Amit Verma', amount: 740, method: 'Credit Card', status: 'PAID', date: '22 Sep 08:25 AM' },
    { id: 'TXN-9018', orderNumber: 'ORD-004', customer: 'Neha Jain', amount: 1520, method: 'UPI (PhonePe)', status: 'PAID', date: '21 Sep 06:45 PM' },
    { id: 'TXN-9017', orderNumber: 'ORD-005', customer: 'Suresh Kumar', amount: 620, method: 'COD (Collected)', status: 'PAID', date: '21 Sep 05:15 PM' },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payments & Reconciliation</h1>
        <p className="text-xs text-slate-500 mt-1">Track digital gateway payments, cash on delivery collections, and refund records</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <p className="text-xs text-slate-500 font-semibold">Total Revenue (Month)</p>
          <p className="text-2xl font-black text-slate-900 mt-1">₹84,620</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <p className="text-xs text-slate-500 font-semibold">Online Gateway Settlement</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">₹68,450</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <p className="text-xs text-slate-500 font-semibold">COD Collected by Drivers</p>
          <p className="text-2xl font-black text-blue-600 mt-1">₹16,170</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">Transaction ID</th>
                <th className="px-6 py-3.5">Order #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-bold font-mono text-slate-700">{t.id}</td>
                  <td className="px-6 py-3.5 font-mono text-blue-700 font-semibold">{t.orderNumber}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800">{t.customer}</td>
                  <td className="px-6 py-3.5 font-bold text-slate-900">₹{t.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3.5 text-slate-600">{t.method}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${t.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-400">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
