'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { clsx } from 'clsx';
import {
  LayoutDashboard, ShoppingBag, Users, Shirt, Layers, ShieldCheck,
  Truck, CreditCard, MessageSquare, UserCheck, Settings as SettingsIcon,
  Search, Bell, Calendar, ChevronDown, LogOut, Menu, X
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { href: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/orders',      label: 'Orders',      icon: ShoppingBag },
  { href: '/customers',   label: 'Customers',   icon: Users },
  { href: '/services',    label: 'Services',    icon: SettingsIcon },
  { href: '/garments',    label: 'Garments',    icon: Shirt },
  { href: '/processing',  label: 'Processing',  icon: Layers },
  { href: '/qc',          label: 'QC',          icon: ShieldCheck },
  { href: '/drivers',     label: 'Drivers',     icon: Truck },
  { href: '/payments',    label: 'Payments',    icon: CreditCard },
  { href: '/complaints',  label: 'Complaints',  icon: MessageSquare },
  { href: '/users',       label: 'Users',       icon: UserCheck },
  { href: '/settings',    label: 'Settings',    icon: SettingsIcon },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState('Admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('cc_admin_token');
    if (!token) {
      // In dev mode, provide an easy auto-session if user is browsing
      const mockUser = { name: 'Admin', role: 'SUPER_ADMIN' };
      localStorage.setItem('cc_admin_token', 'dev_admin_token');
      localStorage.setItem('cc_admin_user', JSON.stringify(mockUser));
    }
    const user = localStorage.getItem('cc_admin_user');
    if (user) {
      try {
        setAdminName(JSON.parse(user).name ?? 'Admin');
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cc_admin_token');
    localStorage.removeItem('cc_admin_user');
    router.replace('/login');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* ---- Left Sidebar (Dark Navy Theme) ---- */}
      <aside className={clsx(
        'flex-shrink-0 bg-[#0F172A] text-slate-300 flex flex-col transition-all duration-200 z-40',
        'fixed inset-y-0 left-0 lg:static',
        sidebarOpen ? 'w-60 translate-x-0 shadow-2xl' : 'w-60 -translate-x-full lg:translate-x-0'
      )}>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800/80 flex-shrink-0">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-blue-500/25 border border-slate-700 bg-white ring-1 ring-white/80 flex-shrink-0">
            <img src="/images/logo.png" alt="CleanCare" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none">CleanCare</h1>
            <p className="text-[11px] font-semibold text-blue-400 mt-1 uppercase tracking-wider">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-150',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                )}
              >
                <Icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-white' : 'text-slate-400')} />
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Chip */}
        <div className="p-3 border-t border-slate-800/80">
          <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-2.5 border border-slate-700/50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
              {adminName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{adminName}</p>
              <p className="text-[10px] text-slate-400">Operations Manager</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 transition-colors p-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ---- Main Container ---- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-100 h-16 flex items-center px-4 sm:px-6 gap-3 sm:gap-6 flex-shrink-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, customers..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Date range picker pill */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-medium ml-auto">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>22 Sep 2026 - 22 Sep 2026</span>
          </div>

          {/* Notification bell & Profile dropdown */}
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-600 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                {adminName[0]}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{adminName}</p>
                <p className="text-[10px] text-slate-400">Admin</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Main View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
