'use client';

import React, { useState } from 'react';
import { Smartphone, Truck, ShieldCheck, Home, Copy, Check, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PortalSwitcher({ currentApp = 'customer' }: { currentApp?: 'customer' | 'driver' | 'admin' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyOtp = () => {
    navigator.clipboard.writeText('123456');
    setCopied(true);
    toast.success('Test OTP 123456 copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-sans antialiased text-xs">
      {/* Expanded Panel */}
      {isOpen && (
        <div className="mb-2 p-3.5 rounded-2xl bg-slate-950/95 text-slate-100 border border-slate-700/80 shadow-2xl shadow-black/60 backdrop-blur-xl w-72 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400">
              CleanCare Switcher
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Links to all apps */}
          <div className="space-y-1.5 mb-3">
            <a
              href="http://localhost:3000"
              className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                currentApp === 'customer'
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span>Customer App</span>
              </div>
              <span className="text-[10px] text-slate-400">:3000</span>
            </a>

            <a
              href="http://localhost:3001"
              className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                currentApp === 'driver'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Driver Partner</span>
              </div>
              <span className="text-[10px] text-slate-400">:3001</span>
            </a>

            <a
              href="http://localhost:3002"
              className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                currentApp === 'admin'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Operations</span>
              </div>
              <span className="text-[10px] text-slate-400">:3002</span>
            </a>

            <a
              href="http://localhost:3000"
              className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <div className="flex items-center gap-2">
                <Home className="w-3.5 h-3.5" />
                <span>CleanCare Gateway Hub</span>
              </div>
              <span className="text-[10px]">🏠</span>
            </a>
          </div>

          {/* Quick OTP Copy */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Dev OTP: <strong className="text-emerald-400 font-mono">123456</strong></span>
            </div>
            <button
              onClick={copyOtp}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-950/90 text-white border border-slate-700/80 shadow-xl shadow-black/40 hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-extrabold text-[11px]">
          {currentApp === 'customer' ? '📱 Customer' : currentApp === 'driver' ? '🚚 Driver' : '💼 Admin'}
        </span>
        <span className="text-slate-500 font-light">|</span>
        <span className="text-slate-400 text-[10px] font-bold">Switch Portal</span>
        {isOpen ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronUp className="w-3 h-3 text-slate-400" />}
      </button>
    </div>
  );
}
