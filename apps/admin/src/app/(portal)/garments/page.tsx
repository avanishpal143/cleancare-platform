'use client';

import { useState, useEffect } from 'react';
import { Shirt, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://cleancare-platform.onrender.com/api';

function authH() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('cc_admin_token') : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function GarmentsPage() {
  const [garments, setGarments] = useState<any[]>([
    { id: '1', name: 'Shirt', category: 'Men / Women', unitPrice: 60, serviceName: 'Dry Cleaning & Laundry', icon: '👔', isActive: true },
    { id: '2', name: 'Trouser', category: 'Bottom Wear', unitPrice: 70, serviceName: 'Dry Cleaning & Ironing', icon: '👖', isActive: true },
    { id: '3', name: 'Suit (2-Piece)', category: 'Formal Wear', unitPrice: 150, serviceName: 'Special Care / Dry Clean', icon: '🧥', isActive: true },
    { id: '4', name: 'Saree', category: 'Ethnic Wear', unitPrice: 120, serviceName: 'Special Care / Roll Press', icon: '🥻', isActive: true },
    { id: '5', name: 'Jacket / Blazer', category: 'Outerwear', unitPrice: 100, serviceName: 'Dry Cleaning', icon: '🧥', isActive: true },
    { id: '6', name: 'Blanket / Quilt', category: 'Household', unitPrice: 200, serviceName: 'Heavy Laundry', icon: '🛏️', isActive: true },
    { id: '7', name: 'Kurta', category: 'Ethnic Wear', unitPrice: 80, serviceName: 'Dry Cleaning & Ironing', icon: '👗', isActive: true },
    { id: '8', name: 'Curtains (Per Panel)', category: 'Home Decor', unitPrice: 150, serviceName: 'Curtain Cleaning', icon: '🪟', isActive: true },
  ]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${API}/garments`, { headers: authH() })
      .then((res) => {
        if (res.data?.data?.items?.length) {
          setGarments(res.data.data.items);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = garments.filter(g =>
    g.name?.toLowerCase().includes(search.toLowerCase()) ||
    g.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Garments</h1>
          <p className="text-xs text-slate-500 mt-1">Configure garment catalogue, standard base rates, and handling specifications</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search garment name or category..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">{filtered.length} garments configured</span>
      </div>

      {/* Garments Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">Garment</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Default Rate</th>
                <th className="px-6 py-3.5">Associated Services</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((garment) => (
                <tr key={garment.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-xl flex items-center justify-center border border-blue-100">
                        {garment.icon || '👕'}
                      </div>
                      <span className="font-bold text-slate-900">{garment.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 font-medium">
                    {garment.category || 'General'}
                  </td>
                  <td className="px-6 py-3.5 font-bold text-slate-900">
                    ₹{garment.unitPrice ?? garment.basePrice ?? 60}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                      {garment.serviceName || 'Dry Cleaning'}
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
