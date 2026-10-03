'use client';

import { useState } from 'react';
import { UserCheck, Shield, Plus, Key } from 'lucide-react';

export default function UsersPage() {
  const [users] = useState([
    { id: '1', name: 'Super Admin', mobile: '+91 98000 00001', role: 'SUPER_ADMIN', email: 'admin@cleancare.app', status: 'ACTIVE' },
    { id: '2', name: 'Operations Manager', mobile: '+91 98000 00002', role: 'OPS_MANAGER', email: 'ops@cleancare.app', status: 'ACTIVE' },
    { id: '3', name: 'Manoj QC Inspector', mobile: '+91 98000 00003', role: 'QC_INSPECTOR', email: 'qc@cleancare.app', status: 'ACTIVE' },
    { id: '4', name: 'Deepak Facility Tech', mobile: '+91 98000 00004', role: 'FACILITY_TECH', email: 'facility@cleancare.app', status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Staff & Access Control</h1>
        <p className="text-xs text-slate-500 mt-1">Role-based permission controls (RBAC) and internal operational staff</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Contact</th>
                <th className="px-6 py-3.5">Assigned Role</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-bold text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 font-mono">{u.mobile}</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {u.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
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
