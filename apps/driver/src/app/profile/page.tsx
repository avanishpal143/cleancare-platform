'use client';

import { useState } from 'react';
import { ChevronLeft, User, Phone, Truck, Shield, Star, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DriverProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('cc_driver_token');
    localStorage.removeItem('cc_driver_user');
    router.replace('/login');
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen">


      <header className="px-5 pt-2 pb-3 border-b border-slate-100 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-extrabold text-slate-900 leading-tight">My Profile</h1>
      </header>

      <div className="flex-1 p-5 space-y-4">
        {/* Profile Card */}
        <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/25 mb-3">
            R
          </div>
          <h2 className="text-base font-bold text-slate-900">Rakesh Meena</h2>
          <p className="text-xs text-slate-400 font-medium">+91 98765 00010</p>
          <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.9 Rating (340 Jobs)
          </div>
        </div>

        {/* Details list */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3 text-xs">
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Partner ID</span>
            <span className="font-bold text-slate-800 font-mono">DRV-2026-081</span>
          </div>
          <div className="flex justify-between py-1 border-t border-slate-100">
            <span className="text-slate-400">Assigned Vehicle</span>
            <span className="font-semibold text-slate-800">Electric Van (RJ 14 EV 2026)</span>
          </div>
          <div className="flex justify-between py-1 border-t border-slate-100">
            <span className="text-slate-400">Service Area</span>
            <span className="font-semibold text-slate-800">Mansarovar & Vaishali Nagar</span>
          </div>
          <div className="flex justify-between py-1 border-t border-slate-100">
            <span className="text-slate-400">Status</span>
            <span className="font-bold text-emerald-600">Verified & Active</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-6"
        >
          <LogOut className="w-4 h-4" /> End Shift / Logout
        </button>
      </div>
    </div>
  );
}
