'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, X, Package, Clock, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { apiGet } from '@/lib/api';
import { motion } from 'framer-motion';
import {
  RealisticShieldBadge,
  RealisticVanBadge,
  RealisticShirtIcon,
} from '@/components/RealisticIcons';

const STATUS_FILTERS = ['All', 'Processing', 'Booked', 'Picked Up', 'Delivered'];

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([
    {
      id: 'ORD-20260922-001',
      orderNumber: 'ORD-20260922-001',
      serviceName: 'Dry Cleaning',
      garmentCount: 12,
      totalAmount: 1240,
      status: 'PROCESSING',
      date: '22 Sep 2026',
    },
    {
      id: 'ORD-20260920-004',
      orderNumber: 'ORD-20260920-004',
      serviceName: 'Laundry & Ironing',
      garmentCount: 8,
      totalAmount: 560,
      status: 'DELIVERED',
      date: '20 Sep 2026',
    },
    {
      id: 'ORD-20260918-002',
      orderNumber: 'ORD-20260918-002',
      serviceName: 'Special Care (Suit)',
      garmentCount: 3,
      totalAmount: 450,
      status: 'DELIVERED',
      date: '18 Sep 2026',
    },
  ]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    apiGet<any>('/customer/orders')
      .then((res) => {
        if (res?.items?.length) {
          setOrders(
            res.items.map((o: any) => ({
              id: o.orderNumber || o.id,
              orderNumber: o.orderNumber || 'ORD-001',
              serviceName: o.service?.name || 'Dry Cleaning',
              garmentCount: o.garmentCount || 8,
              totalAmount: o.totalAmount || 840,
              status: o.status,
              date: new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' ? true : o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Order History
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            View live status, past laundry invoices, and reorder
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/book"
            className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5"
          >
            <span>+ New Booking</span>
          </Link>
        </motion.div>
      </div>

      {/* Quick Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-sky-100 shadow-xs flex items-center gap-3.5 group hover:border-blue-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-blue-50/80 border border-blue-100/80 flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-xs">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-600 animate-pulse" />
            <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ripple" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Laundry</p>
            <p className="text-sm font-black text-slate-900">1 In Processing</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-sky-100 shadow-xs flex items-center gap-3.5 group hover:border-emerald-300 transition-colors">
          <RealisticShieldBadge className="w-11 h-11 flex-shrink-0 group-hover:scale-105 transition-transform" />
          <div>
            <p className="text-xs text-slate-500 font-medium">Delivered to Doorstep</p>
            <p className="text-sm font-black text-slate-900">2 Orders Fresh</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-sky-100 shadow-xs flex items-center gap-3.5 group hover:border-sky-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-sky-50/80 border border-sky-100/80 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <RealisticShirtIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Garments Cared</p>
            <p className="text-sm font-black text-slate-900">23 Clean Clothes</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID (e.g. ORD-001) or service..."
            className="w-full pl-10 pr-9 py-3 bg-white/80 backdrop-blur-md border border-sky-100 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-xs"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {STATUS_FILTERS.map((s) => (
            <motion.button
              key={s}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
                statusFilter === s
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-100'
                  : 'bg-white/80 backdrop-blur-md border border-sky-100 text-slate-600 hover:bg-white'
              )}
            >
              {s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Orders Grid (1 col on mobile, 2 cols on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((order, idx) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.25 }}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={`/orders/${order.id}`}
              className="p-5 rounded-3xl border border-sky-100 bg-white/85 backdrop-blur-xl hover:border-blue-300 hover:shadow-xl hover:shadow-sky-500/10 transition-all block group shadow-xs select-none"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-900 text-sm">{order.orderNumber}</span>
                  <span
                    className={clsx(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold',
                      order.status === 'PROCESSING'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    )}
                  >
                    {order.status}
                  </span>
                </div>

                <span className="text-xs text-slate-400 font-medium">{order.date}</span>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">{order.serviceName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{order.garmentCount} Garments</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-slate-900">₹{order.totalAmount}</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50/70 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {order.status === 'PROCESSING' && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    Ozone Wash in Progress
                  </span>
                  <span className="text-slate-400 font-medium">Est: Tomorrow 6 PM</span>
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
