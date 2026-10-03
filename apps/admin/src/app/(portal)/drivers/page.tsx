'use client';

import { useState, useEffect } from 'react';
import { Truck, Phone, CheckCircle2, Search, Plus, MapPin } from 'lucide-react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://cleancare-platform.onrender.com/api';

function authH() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('cc_admin_token') : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function DriversAdminPage() {
  const [drivers, setDrivers] = useState([
    { id: '1', name: 'Rakesh Meena', mobile: '+91 98765 00010', vehicleType: 'E-Van', vehicleNumber: 'RJ 14 EV 2026', todayPickups: 8, todayDeliveries: 6, status: 'ONLINE', area: 'Mansarovar & Vaishali Nagar' },
    { id: '2', name: 'Sanjay Rawat', mobile: '+91 98765 00011', vehicleType: 'Bike', vehicleNumber: 'RJ 14 BK 4012', todayPickups: 6, todayDeliveries: 4, status: 'ONLINE', area: 'C-Scheme & Civil Lines' },
    { id: '3', name: 'Mukesh Choudhary', mobile: '+91 98765 00012', vehicleType: 'Van', vehicleNumber: 'RJ 14 VN 8811', todayPickups: 0, todayDeliveries: 0, status: 'OFFLINE', area: 'Malviya Nagar' },
  ]);

  useEffect(() => {
    axios.get(`${API}/drivers`, { headers: authH() })
      .then((res) => {
        if (res.data?.data?.items?.length) {
          setDrivers(res.data.data.items);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Driver Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage field partners, routes, pickup/delivery allocations, and live availability</p>
        </div>
      </div>

      {/* Driver Roster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  {driver.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{driver.name}</h3>
                  <p className="text-xs text-slate-400">{driver.mobile}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${driver.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                ● {driver.status}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 mt-4 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Vehicle:</span>
                <span className="font-semibold text-slate-800">{driver.vehicleType} ({driver.vehicleNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Zone:</span>
                <span className="font-medium text-slate-700">{driver.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Today's Jobs:</span>
                <span className="font-bold text-blue-600">{driver.todayPickups} Pickups · {driver.todayDeliveries} Deliveries</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
