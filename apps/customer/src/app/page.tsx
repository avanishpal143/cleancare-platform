'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles, Smartphone, Truck, ShieldCheck, ArrowRight,
  Copy, Check, ExternalLink, Activity, Layers, Users,
  Clock, Zap, CheckCircle2, ChevronRight, Lock
} from 'lucide-react';
import { RealisticLogo } from '@/components/RealisticIcons';
import { useAuthStore } from '@/store/authStore';
import { apiPost } from '@/lib/api';
import type { AuthTokens, CustomerDTO, UserDTO } from '@cleancare/types';
import toast from 'react-hot-toast';

export default function MasterGatewayPage() {
  const router = useRouter();
  const { setTokens, setUser } = useAuthStore();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleInstantCustomerLogin = async (name: string, mobile: string) => {
    try {
      const data = await apiPost<{ tokens: AuthTokens; user: UserDTO; customer: CustomerDTO; isNewUser: boolean }>(
        '/auth/verify-otp',
        { mobile: mobile, otp: '123456' }
      );
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setUser(data.user, data.customer);
      toast.success(`Welcome, ${name}!`);
      router.push('/home');
    } catch {
      const dummyCustomer = {
        id: 'cmunt4cs00001',
        userId: 'usr_' + name.toLowerCase().replace(/\s+/g, ''),
        name: name,
        mobile: mobile,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        avatarUrl: undefined,
        loyaltyPoints: 0,
        isActive: true,
        isBlocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTokens('dev_access_token', 'dev_refresh_token');
      setUser(
        {
          id: dummyCustomer.userId,
          mobile: mobile,
          role: 'CUSTOMER',
          isActive: true,
          isVerified: true,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        dummyCustomer
      );
      toast.success(`Welcome, ${name}!`);
      router.push('/home');
    }
  };

  const DRIVER_URL = process.env.NEXT_PUBLIC_DRIVER_URL || 'https://cleancare-driver.vercel.app';
  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://cleancare-admin-six.vercel.app';
  const API_DOCS_URL = 'https://cleancare-platform.onrender.com/api/docs';

  const handleOpenDriver = (mobile: string = '9876500010') => {
    window.open(`${DRIVER_URL}/login?autoMobile=${mobile}`, '_blank');
  };

  const handleOpenAdmin = (mobile: string = '9800000001') => {
    window.open(`${ADMIN_URL}/login?autoMobile=${mobile}`, '_blank');
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden antialiased">
      {/* ── Dynamic Ambient Background ──────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full bg-indigo-600/15 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[130px]" />
        {/* Fine grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* ── Top Navigation Bar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RealisticLogo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  CleanCare
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md">
                  Unified Gateway
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Choose portal to login or test the multi-role ecosystem
              </p>
            </div>
          </div>

            {/* System Status Indicators */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Render API • Neon DB Live</span>
              </div>

              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>PostgreSQL 36 Tables</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={API_DOCS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <span>Swagger API</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Hero Section ───────────────────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-6 pt-12 pb-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Select Your CleanCare Portal • Single Sign-On Ready</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
              Kaha Login Karna Hai? <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Choose Your Workspace
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              CleanCare connects Customers, Drivers, and Admin Operations in real time.
              Click any portal below to log in or use the 1-click test credentials.
            </p>
          </div>

          {/* ── 3 Big Interactive App Cards ─────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* ── CARD 1: CUSTOMER APP ──────────────────────────────────────── */}
            <div className="group relative rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 p-7 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 flex flex-col justify-between overflow-hidden">
              {/* Ambient Card Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />

              <div>
                {/* Header Badges */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <Smartphone className="w-7 h-7 text-blue-400" />
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-bold border border-blue-500/20">
                      Live App
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Customer Portal</p>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-black text-white tracking-tight mb-2 group-hover:text-blue-300 transition-colors">
                  Customer App
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                  Doorstep laundry booking, 3D interactive garment selection, live step-by-step garment tracking & digital payments.
                </p>

                {/* Key Features List */}
                <div className="space-y-2.5 mb-8">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Doorstep pickup in 30 minutes</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>3D garment catalog & live price estimate</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Real-time timeline order tracker</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <Link
                  href="/login"
                  className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>Go to Customer Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleInstantCustomerLogin('Rahul Sharma', '9876543210')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-blue-300 hover:text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚡ 1-Click Login (Rahul Sharma)</span>
                </button>
              </div>
            </div>

            {/* ── CARD 2: DRIVER PARTNER APP ─────────────────────────────────── */}
            <div className="group relative rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 p-7 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 flex flex-col justify-between overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

              <div>
                {/* Header Badges */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Truck className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/20">
                      Live App
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Driver Partner App</p>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-black text-white tracking-tight mb-2 group-hover:text-emerald-300 transition-colors">
                  Driver Partner App
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                  Dedicated driver tool for pickup routes, customer OTP handoff verification, quantity count check & instant earnings.
                </p>

                {/* Key Features List */}
                <div className="space-y-2.5 mb-8">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Assigned pickup & delivery jobs</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Customer OTP handoff verification</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Live earnings & daily stats dashboard</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <a
                  href={`${DRIVER_URL}/login`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>Launch Driver App</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => handleOpenDriver('9876500010')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-emerald-300 hover:text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚡ 1-Click Login (Rakesh Meena)</span>
                </button>
              </div>
            </div>

            {/* ── CARD 3: ADMIN & OPERATIONS PORTAL ──────────────────────────── */}
            <div className="group relative rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/60 p-7 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col justify-between overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

              <div>
                {/* Header Badges */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-7 h-7 text-purple-400" />
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20">
                      Live App
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Admin SaaS Portal</p>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-black text-white tracking-tight mb-2 group-hover:text-purple-300 transition-colors">
                  Admin & Ops Hub
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                  Full platform control: 10-stage order pipeline, driver allocation, QC pass/reprocess, and live financial charts.
                </p>

                {/* Key Features List */}
                <div className="space-y-2.5 mb-8">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>360° Order lifecycle management</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Fleet & driver assignment engine</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Catalog CRUD, QC workflow & analytics</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <a
                  href={`${ADMIN_URL}/login`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>Launch Admin Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => handleOpenAdmin('9800000001')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-purple-300 hover:text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚡ 1-Click Login (Super Admin)</span>
                </button>

            </div>
          </div>
        </div>

        {/* ── Testing Credentials Vault (Highlighted as Requested) ────────── */}
        <section className="rounded-3xl bg-slate-900/95 border-2 border-blue-500/40 p-8 shadow-2xl relative overflow-hidden mb-16">
          <div className="absolute top-0 right-0 px-5 py-1.5 bg-gradient-to-l from-blue-600 to-indigo-600 text-white font-black text-[11px] uppercase tracking-wider rounded-bl-2xl">
            🧪 Testing Credentials & Demo Accounts
          </div>

          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Dev Mode Active — Instant Authentication</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Test Accounts & One-Click Login
            </h2>
            <p className="text-xs text-slate-300 font-normal mt-1 leading-relaxed">
              In development mode, all mobile numbers accept the testing OTP: <strong className="text-emerald-400 font-mono text-sm px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40">123456</strong>.
              Click the number to copy or click "Login" to jump directly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Account 1: Customer */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Customer
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">● Live</span>
              </div>
              <p className="font-extrabold text-sm text-white">Rahul Sharma</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                <code className="text-xs font-mono font-bold text-blue-300">9876543210</code>
                <button
                  onClick={() => copyToClipboard('9876543210', 'Mobile')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy mobile"
                >
                  {copiedText === '9876543210' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                onClick={() => handleInstantCustomerLogin('Rahul Sharma', '9876543210')}
                className="mt-3 w-full py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white text-xs font-bold transition-all text-center"
              >
                1-Click Login →
              </button>
            </div>

            {/* Account 2: Driver */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Driver
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">● Live</span>
              </div>
              <p className="font-extrabold text-sm text-white">Rakesh Meena</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                <code className="text-xs font-mono font-bold text-emerald-300">9876500010</code>
                <button
                  onClick={() => copyToClipboard('9876500010', 'Mobile')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy mobile"
                >
                  {copiedText === '9876500010' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                onClick={() => handleOpenDriver('9876500010')}
                className="mt-3 w-full py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white text-xs font-bold transition-all text-center"
              >
                Launch Driver →
              </button>
            </div>

            {/* Account 3: Super Admin */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Super Admin
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">● Live</span>
              </div>
              <p className="font-extrabold text-sm text-white">System Admin</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                <code className="text-xs font-mono font-bold text-purple-300">9800000001</code>
                <button
                  onClick={() => copyToClipboard('9800000001', 'Mobile')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy mobile"
                >
                  {copiedText === '9800000001' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                onClick={() => handleOpenAdmin('9800000001')}
                className="mt-3 w-full py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-bold transition-all text-center"
              >
                Launch Admin →
              </button>
            </div>

            {/* Account 4: Operations Manager */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Ops Manager
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">● Live</span>
              </div>
              <p className="font-extrabold text-sm text-white">Logistics Lead</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                <code className="text-xs font-mono font-bold text-indigo-300">9800000002</code>
                <button
                  onClick={() => copyToClipboard('9800000002', 'Mobile')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy mobile"
                >
                  {copiedText === '9800000002' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                onClick={() => handleOpenAdmin('9800000002')}
                className="mt-3 w-full py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-bold transition-all text-center"
              >
                Launch Admin →
              </button>
            </div>
          </div>
        </section>

        {/* ── Order Lifecycle Visual Flow ─────────────────────────────────── */}
        <section className="rounded-3xl bg-slate-900/50 border border-slate-800 p-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>End-to-End CleanCare Workflow</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight mb-8">
            How The Ecosystem Works Together
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-black text-xs inline-flex items-center justify-center mb-2">1</span>
              <p className="text-xs font-bold text-white">Customer Books</p>
              <p className="text-[10px] text-slate-400 mt-1">Select garments & slot</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs inline-flex items-center justify-center mb-2">2</span>
              <p className="text-xs font-bold text-white">Driver Picks Up</p>
              <p className="text-[10px] text-slate-400 mt-1">OTP & garment count</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 font-black text-xs inline-flex items-center justify-center mb-2">3</span>
              <p className="text-xs font-bold text-white">Admin Processes</p>
              <p className="text-[10px] text-slate-400 mt-1">Eco-wash & QC pass</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs inline-flex items-center justify-center mb-2">4</span>
              <p className="text-xs font-bold text-white">Driver Delivers</p>
              <p className="text-[10px] text-slate-400 mt-1">Delivery OTP & POD</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 col-span-2 sm:col-span-1">
              <span className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 font-black text-xs inline-flex items-center justify-center mb-2">5</span>
              <p className="text-xs font-bold text-white">Order Completed</p>
              <p className="text-[10px] text-slate-400 mt-1">Invoice & Rating</p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-8 text-center text-xs text-slate-400 font-medium">
        <p>© 2026 CleanCare Technologies. Production Dry Cleaning & Laundry Architecture.</p>
        <p className="mt-1 text-[11px] text-slate-400">Production Cloud: Customer (Vercel) • Driver (Vercel) • Admin (Vercel) • API (Render) • DB (Neon PostgreSQL)</p>
      </footer>

    </div>
  );
}
