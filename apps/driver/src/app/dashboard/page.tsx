'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardList, Wallet, User, HelpCircle, LogOut, ChevronRight,
  Package, Truck, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://cleancare-platform.onrender.com/api';

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('cc_driver_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function DriverDashboard() {
  const router = useRouter();
  const [driver, setDriver] = useState<any>({ name: 'Rakesh Meena', mobile: '9876500010' });
  const [stats, setStats] = useState({
    todayJobs: 14,
    pickups: 8,
    deliveries: 6,
  });

  useEffect(() => {
    // If not logged in, auto-login with default dev driver for seamless demo
    const stored = localStorage.getItem('cc_driver_user');
    if (!stored) {
      const defaultDriver = { name: 'Rakesh!', mobile: '9876500010' };
      localStorage.setItem('cc_driver_user', JSON.stringify(defaultDriver));
      localStorage.setItem('cc_driver_token', 'dev_driver_token');
      setDriver(defaultDriver);
    } else {
      try {
        setDriver(JSON.parse(stored));
      } catch {}
    }

    axios.get(`${API}/drivers/me/dashboard`, { headers: authHeaders() })
      .then((r) => {
        if (r.data?.data) {
          const d = r.data.data;
          setStats({
            todayJobs: (d.todayPickups ?? 8) + (d.todayDeliveries ?? 6),
            pickups: d.todayPickups ?? 8,
            deliveries: d.todayDeliveries ?? 6,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cc_driver_token');
    localStorage.removeItem('cc_driver_refresh');
    localStorage.removeItem('cc_driver_user');
    router.replace('/login');
  };

  const driverFirstName = driver?.name?.replace('!', '').split(' ')[0] || 'Rakesh';

  return (
    <div className="flex-1 flex flex-col bg-white">

      {/* Header with avatar */}
      <header className="px-5 pt-3 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Laundry Partner
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            {driverFirstName[0]}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Good Morning,</p>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {driverFirstName}!
            </h1>
          </div>
        </div>
      </header>

      {/* 3 KPI Stats Row */}
      <div className="px-5 py-2">
        <div className="grid grid-cols-3 gap-3">
          {/* Today's Jobs */}
          <Link
            href="/jobs"
            className="bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-3.5 border border-slate-100 text-center transition-all active:scale-95"
          >
            <p className="text-2xl font-black text-blue-600 leading-none">{stats.todayJobs}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1.5">Today's Jobs</p>
          </Link>

          {/* Pickups */}
          <Link
            href="/jobs?tab=PICKUP"
            className="bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-3.5 border border-slate-100 text-center transition-all active:scale-95"
          >
            <p className="text-2xl font-black text-emerald-600 leading-none">{stats.pickups}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1.5">Pickups</p>
          </Link>

          {/* Deliveries */}
          <Link
            href="/jobs?tab=DELIVERY"
            className="bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-3.5 border border-slate-100 text-center transition-all active:scale-95"
          >
            <p className="text-2xl font-black text-amber-600 leading-none">{stats.deliveries}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1.5">Deliveries</p>
          </Link>
        </div>
      </div>

      {/* Main Menu List */}
      <div className="flex-1 px-5 py-4 space-y-2.5">
        {/* My Jobs */}
        <Link
          href="/jobs"
          className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">My Jobs</p>
            <p className="text-xs text-slate-400">View today's assigned route</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </Link>

        {/* Earnings */}
        <Link
          href="/earnings"
          className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">Earnings</p>
            <p className="text-xs text-slate-400">Daily, weekly, monthly stats</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </Link>

        {/* My Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">My Profile</p>
            <p className="text-xs text-slate-400">Vehicle details & credentials</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </Link>

        {/* Help & Support */}
        <Link
          href="/help"
          className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">Help & Support</p>
            <p className="text-xs text-slate-400">Dispatcher hotline & FAQs</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-rose-50/50 border border-rose-100 hover:bg-rose-50 active:scale-[0.98] transition-all text-left mt-4"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-rose-600">Logout</p>
            <p className="text-xs text-rose-400">End your partner shift</p>
          </div>
        </button>
      </div>

      {/* Brand Tagline Footer */}
      <div className="p-5 text-center text-xs text-slate-400 border-t border-slate-50">
        Pick. Deliver. Make People Happy.
      </div>
    </div>
  );
}
