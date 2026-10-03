'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, MapPin, ShoppingBag, Eye } from 'lucide-react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://cleancare-platform.onrender.com/api';

function authH() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('cc_admin_token') : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([
    { id: '1', name: 'Rahul Sharma', mobile: '+91 98765 43210', email: 'rahul.sharma@example.com', ordersCount: 14, totalSpent: 12450, city: 'Jaipur', area: 'Mansarovar', status: 'ACTIVE' },
    { id: '2', name: 'Priya Singh', mobile: '+91 98765 11111', email: 'priya.s@example.com', ordersCount: 8, totalSpent: 6890, city: 'Jaipur', area: 'Vaishali Nagar', status: 'ACTIVE' },
    { id: '3', name: 'Amit Verma', mobile: '+91 98765 22222', email: 'amit.verma@example.com', ordersCount: 19, totalSpent: 18200, city: 'Jaipur', area: 'C-Scheme', status: 'ACTIVE' },
    { id: '4', name: 'Neha Jain', mobile: '+91 98765 33333', email: 'neha.jain@example.com', ordersCount: 5, totalSpent: 4350, city: 'Jaipur', area: 'Malviya Nagar', status: 'ACTIVE' },
    { id: '5', name: 'Suresh Kumar', mobile: '+91 98765 55555', email: 'suresh.k@example.com', ordersCount: 22, totalSpent: 24600, city: 'Jaipur', area: 'Raja Park', status: 'ACTIVE' },
  ]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/customers`, { headers: authH() })
      .then((res) => {
        if (res.data?.data?.items?.length) {
          setCustomers(res.data.data.items);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-xs text-slate-500 mt-1">Manage verified customer profiles, addresses, and order histories</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">{filtered.length} customers found</span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Contact</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Total Orders</th>
                <th className="px-6 py-3.5">Total Spent</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {customer.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{customer.name}</p>
                        <p className="text-[10px] text-slate-400 font-normal">Customer #{customer.id.slice(-4)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="font-medium text-slate-700">{customer.mobile}</p>
                    <p className="text-[11px] text-slate-400">{customer.email || '—'}</p>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 font-medium">
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {customer.area ? `${customer.area}, ` : ''}{customer.city || 'Jaipur'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-slate-800">
                    {customer.ordersCount ?? customer._count?.orders ?? 0}
                  </td>
                  <td className="px-6 py-3.5 font-bold text-slate-900">
                    ₹{(customer.totalSpent ?? 0).toLocaleString('en-IN')}
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
