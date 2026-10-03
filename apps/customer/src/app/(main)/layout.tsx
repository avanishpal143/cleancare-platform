'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, ShoppingBag, CalendarDays, Tag, User, MapPin,
  Bell, ChevronDown, Plus, ShieldCheck, Phone
} from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { RealisticLogo } from '@/components/RealisticIcons';

const NAV_ITEMS = [
  { href: '/home',    label: 'Home',    Icon: Home },
  { href: '/orders',  label: 'Orders',  Icon: ShoppingBag },
  { href: '/book',    label: 'Book',    Icon: CalendarDays },
  { href: '/offers',  label: 'Offers',  Icon: Tag },
  { href: '/profile', label: 'Profile', Icon: User },
] as const;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { isAuthenticated, setTokens, setUser, customer } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      const stored = localStorage.getItem('cc_customer');
      if (!stored) {
        const dummyCustomer = {
          id: 'cmunt4cs00001',
          userId: 'usr_satyanarayan',
          name: 'Satyanarayan',
          mobile: '9876543210',
          email: 'satyanarayan@example.com',
          avatarUrl: null,
          isBlocked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTokens('dev_token', 'dev_refresh');
        setUser(
          { id: 'usr_satyanarayan', mobile: '9876543210', role: 'CUSTOMER', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          dummyCustomer
        );
      }
    }
  }, [isAuthenticated, setTokens, setUser]);

  if (!mounted) return null;

  const customerName = customer?.name || 'Satyanarayan';

  // Focused flow pages (booking steps or order tracking detail) do NOT show main header or bottom nav
  const isFlowPage = pathname.startsWith('/book') || (pathname.startsWith('/orders/') && pathname !== '/orders');

  return (
    <div className="min-h-screen relative flex flex-col font-sans antialiased text-slate-900 selection:bg-blue-600 selection:text-white overflow-x-hidden bg-gradient-to-b from-[#eaf4ff] via-[#f3f8ff] to-[#e6f1ff]">
      
      {/* ── Ambient Fluid Water Elements (Soothing Aquatic Aura & Ripple Orbs) ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft cyan water glow top left */}
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-cyan-200/45 via-sky-300/35 to-blue-200/25 blur-[95px] animate-pulse-glow" />

        {/* Soft sky-blue water glow top right */}
        <div className="absolute top-10 -right-36 w-[620px] h-[620px] rounded-full bg-gradient-to-bl from-blue-300/35 via-sky-200/40 to-indigo-100/25 blur-[105px] animate-water-wave" />

        {/* Soft aquatic teal center glow */}
        <div className="absolute top-1/2 left-1/3 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-cyan-100/40 via-sky-100/30 to-transparent blur-[110px]" />

        {/* Soft bottom water reflection */}
        <div className="absolute -bottom-36 right-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-t from-sky-200/40 via-blue-100/30 to-transparent blur-[100px]" />

        {/* Subtle fresh water droplet pattern */}
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* ── 1. DESKTOP STICKY NAVBAR (Screens >= 768px, only on non-flow pages or top desktop) ── */}
      <header className="hidden md:block sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-sky-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-18 flex items-center justify-between gap-6">
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <Link href="/home">
              <RealisticLogo size="md" showText={true} />
            </Link>

            {/* Location selector */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/70 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 cursor-pointer transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Mansarovar, Jaipur</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-1.5">
            {NAV_ITEMS.map(({ href, label, Icon }) => {
              const isActive = pathname === href || (href !== '/home' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    'px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  )}
                >
                  <Icon className={clsx('w-4 h-4', isActive ? 'text-blue-600' : 'text-slate-400')} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/book"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Pickup</span>
            </Link>

            {/* Profile Pill */}
            <Link
              href="/profile"
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200/60"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                {customerName[0]}
              </div>
              <span className="text-xs font-bold text-slate-800">{customerName}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── 2. MOBILE TOP BAR (< 768px, ONLY on non-flow main tabs) ─────── */}
      {!isFlowPage && (
        <header className="md:hidden sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-sky-100 px-4 py-2.5 flex items-center justify-between shadow-xs">
          <Link href="/home" className="flex items-center gap-2.5">
            <RealisticLogo size="sm" showText={false} />
            <div>
              <span className="text-base font-black text-blue-600 tracking-tight leading-none block">CleanCare</span>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                <MapPin className="w-2.5 h-2.5 text-blue-600" />
                <span className="truncate max-w-[130px]">Mansarovar, Jaipur</span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/orders"
              className="w-9 h-9 rounded-xl bg-white/80 border border-slate-200/60 flex items-center justify-center text-slate-600 active:scale-95 transition-all relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            </Link>
            <Link
              href="/profile"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs active:scale-95 transition-all"
            >
              {customerName[0]}
            </Link>
          </div>
        </header>
      )}

      {/* ── 3. MAIN PAGE CONTENT ────────────────────────────────────────── */}
      {isFlowPage ? (
        <main className="flex-1 w-full max-w-xl mx-auto h-[100dvh] md:h-auto md:min-h-[820px] md:my-6 md:rounded-3xl md:border md:border-sky-100/80 md:shadow-xl bg-white/95 backdrop-blur-xl overflow-hidden flex flex-col">
          {children}
        </main>
      ) : (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 md:py-8 pb-28 md:pb-12">
          {children}
        </main>
      )}

      {/* ── 4. DESKTOP FOOTER (Only on non-flow pages) ──────────────────── */}
      {!isFlowPage && (
        <footer className="hidden md:block bg-white/70 backdrop-blur-md border-t border-sky-100/80 mt-auto">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <RealisticLogo size="sm" showText={false} />
              <span className="font-extrabold text-slate-800 text-sm">CleanCare</span>
              <span className="text-slate-300">|</span>
              <span>Premium Doorstep Laundry & Express Dry Cleaning in Jaipur</span>
            </div>

            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                <ShieldCheck className="w-4 h-4" /> 100% Ozone Hygiene Guarantee
              </span>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-slate-700">
                <Phone className="w-3.5 h-3.5 text-blue-600" /> Support: +91 98765 43210
              </span>
              <span className="text-slate-300">|</span>
              <span>© 2026 CleanCare Inc.</span>
            </div>
          </div>
        </footer>
      )}

      {/* ── 5. MOBILE BOTTOM NAVIGATION DOCK (< 768px, ONLY on main tabs) ── */}
      {!isFlowPage && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-t border-sky-100 shadow-[0_-4px_25px_rgba(2,132,199,0.08)] safe-bottom">
          <div className="flex items-center justify-around py-2 px-1">
            {NAV_ITEMS.map(({ href, label, Icon }) => {
              const isActive = pathname === href || (href !== '/home' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 select-none',
                    isActive ? 'text-blue-600 scale-105 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-medium'
                  )}
                >
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    className={clsx('relative p-1 rounded-xl transition-all', isActive && 'bg-blue-50 text-blue-600')}
                  >
                    <Icon className="w-5 h-5" />
                    {href === '/orders' && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </motion.div>
                  <span className="text-[10px] leading-none tracking-tight">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
