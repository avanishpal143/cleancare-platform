'use client';

import { useState } from 'react';
import { MessageSquare, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function ComplaintsPage() {
  const [tickets, setTickets] = useState([
    { id: 'TCK-104', orderNumber: 'ORD-009', customer: 'Deepak Joshi', issue: 'Pickup driver delayed by 30 mins', priority: 'MEDIUM', status: 'IN_PROGRESS', date: '22 Sep 11:00 AM' },
    { id: 'TCK-103', orderNumber: 'ORD-004', customer: 'Neha Jain', issue: 'Request special starch on cotton sarees', priority: 'LOW', status: 'RESOLVED', date: '21 Sep 07:15 PM' },
    { id: 'TCK-102', orderNumber: 'ORD-003', customer: 'Amit Verma', issue: 'Incorrect address entered by mistake', priority: 'HIGH', status: 'RESOLVED', date: '21 Sep 02:40 PM' },
  ]);

  const resolveTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'RESOLVED' } : t));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Support & Complaints</h1>
        <p className="text-xs text-slate-500 mt-1">Manage customer queries, delivery exceptions, and service feedback</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">Support Tickets (12 Total, 1 Pending Action)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">Ticket #</th>
                <th className="px-6 py-3.5">Order #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Issue Description</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-bold font-mono text-slate-700">{t.id}</td>
                  <td className="px-6 py-3.5 font-mono text-blue-700 font-semibold">{t.orderNumber}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800">{t.customer}</td>
                  <td className="px-6 py-3.5 text-slate-600 max-w-xs">{t.issue}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${t.priority === 'HIGH' ? 'bg-red-50 text-red-600' : t.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    {t.status !== 'RESOLVED' && (
                      <button
                        onClick={() => resolveTicket(t.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                      >
                        Resolve
                      </button>
                    )}
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
