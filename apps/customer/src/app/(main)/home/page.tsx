'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, ChevronRight, Clock, ShieldCheck, MapPin,
  ArrowRight, CheckCircle2, Star, Truck, Plus, Check,
  Percent, Award, RefreshCw, Layers
} from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  RealisticLogo,
  RealisticSteamPressIcon,
  RealisticSpecialCareIcon,
  RealisticShirtIcon,
  RealisticPantsIcon,
  RealisticSuitIcon,
  RealisticSareeIcon,
  RealisticJacketIcon,
  RealisticBeddingIcon,
  RealisticShieldBadge,
  RealisticVanBadge,
  RealisticClockBadge,
  RealisticMedalBadge,
} from '@/components/RealisticIcons';

export default function CustomerHomePage() {
  const router = useRouter();
  const { customer } = useAuthStore();
  const { setService, setItemQty } = useBookingStore();

  const customerName = customer?.name || 'Satyanarayan';

  // Quick item quantities in state
  const [quickCounts, setQuickCounts] = useState<Record<string, number>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // 4 Services with Rich Colors, Pricing & Turnaround
  const services = [
    {
      id: 'cmunt4csc000n103txahzpohl',
      slug: 'dry-cleaning',
      name: 'Dry Cleaning',
      desc: 'Expert care for suits, sarees, silks & blazers',
      badge: '★ Popular',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      price: 'Starts ₹50/pc',
      time: '24-48 hrs',
      gradient: 'from-emerald-500 to-teal-600',
      bgHover: 'group-hover:border-emerald-300 group-hover:bg-emerald-50/20',
      image: '/images/service_dry_clean.jpg',
      icon: null,
    },
    {
      id: 'cmunt4csr000o103tn0ky0r9y',
      slug: 'laundry',
      name: 'Wash & Fold',
      desc: 'Everyday apparel sanitized with eco-detergents',
      badge: 'Daily Need',
      badgeColor: 'bg-blue-100 text-blue-700',
      price: 'Starts ₹40/kg',
      time: '24 hrs',
      gradient: 'from-blue-500 to-indigo-600',
      bgHover: 'group-hover:border-blue-300 group-hover:bg-blue-50/20',
      image: '/images/service_laundry.jpg',
      icon: null,
    },
    {
      id: 'cmunt4css000p103t5k0222a4',
      slug: 'ironing',
      name: 'Steam Press',
      desc: 'Crisp, wrinkle-free pressing on hangers or folded',
      badge: 'Fast',
      badgeColor: 'bg-rose-100 text-rose-700',
      price: 'Starts ₹20/pc',
      time: 'Same Day',
      gradient: 'from-rose-500 to-amber-500',
      bgHover: 'group-hover:border-rose-300 group-hover:bg-rose-50/20',
      image: null,
      icon: <RealisticSteamPressIcon className="w-12 h-12" />,
    },
    {
      id: 'cmunt4csv000t103twur73wv1',
      slug: 'special-care',
      name: 'Special Care',
      desc: 'Bridal wear, lehengas, woolens & heavy quilts',
      badge: 'Luxury',
      badgeColor: 'bg-purple-100 text-purple-700',
      price: 'Starts ₹120/pc',
      time: '48 hrs',
      gradient: 'from-purple-500 to-fuchsia-600',
      bgHover: 'group-hover:border-purple-300 group-hover:bg-purple-50/20',
      image: null,
      icon: <RealisticSpecialCareIcon className="w-12 h-12" />,
    },
  ];

  // Popular Garments with realistic 3D rendered icons
  const popularGarments = [
    { id: 'g1', name: 'Shirt / Kurta', price: 60, icon: <RealisticShirtIcon className="w-8 h-8" />, tag: 'Men' },
    { id: 'g2', name: 'Trouser / Jeans', price: 70, icon: <RealisticPantsIcon className="w-8 h-8" />, tag: 'Daily' },
    { id: 'g3', name: 'Suit 2-Piece', price: 150, icon: <RealisticSuitIcon className="w-8 h-8" />, tag: 'Formal' },
    { id: 'g4', name: 'Designer Saree', price: 120, icon: <RealisticSareeIcon className="w-8 h-8" />, tag: 'Delicate' },
    { id: 'g5', name: 'Winter Jacket', price: 100, icon: <RealisticJacketIcon className="w-8 h-8" />, tag: 'Heavy' },
    { id: 'g6', name: 'Bed Sheet / Quilt', price: 80, icon: <RealisticBeddingIcon className="w-8 h-8" />, tag: 'Home' },
  ];

  const handleSelectService = (s: any) => {
    setService({
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.desc,
      iconUrl: null,
      imageUrl: null,
      unit: 'PER_ITEM',
      basePrice: 50,
      turnaroundDays: 2,
      minOrderValue: 0,
      isActive: true,
      sortOrder: 1,
      createdAt: '',
      updatedAt: '',
      deletedAt: null,
    });
    router.push('/book');
  };

  const handleQuickAdd = (g: any) => {
    const nextCount = (quickCounts[g.id] || 0) + 1;
    setQuickCounts(prev => ({ ...prev, [g.id]: nextCount }));
    setItemQty(
      {
        id: g.id,
        name: g.name,
        serviceId: 'dry-cleaning',
        unitPrice: g.price,
        pieceCount: 1,
        unit: 'PER_ITEM',
        imageUrl: null,
        sortOrder: 1,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      },
      nextCount
    );
    toast.success(`Added ${g.name} (${nextCount}) to cart!`, { duration: 1500 });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 md:space-y-10"
    >
      
      {/* ── 1. Greeting Banner (Dynamic Context) ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Hello, {customerName}!</span>
            <span className="text-lg md:text-xl">👋</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Ready to refresh your clothes? CleanCare pickup is available in Mansarovar.
          </p>
        </div>

        <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Next slot: Today, 2:00 PM – 4:00 PM</span>
        </div>
      </motion.div>

      {/* ── 2. Hero Interactive Promo Banner (100% Crisp Vector & CSS) ──── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-blue-500/20 overflow-hidden"
      >
        {/* Soft background ambient glow circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-extrabold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Express 24-Hour Doorstep Care</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight">
              Clean Clothes, <br className="hidden sm:inline" />
              <span className="text-blue-200">Brighter Days.</span>
            </h2>

            <p className="text-xs sm:text-sm text-blue-100/90 font-medium leading-relaxed max-w-md">
              Hospital-grade ozone sanitization, German anti-bacterial detergents, and wrinkle-free steam ironing delivered to your doorstep.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/book')}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-xs sm:text-sm shadow-lg shadow-black/10 transition-all flex items-center gap-2"
              >
                <span>Schedule Pickup Now</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.div
                whileTap={{ scale: 0.96 }}
                onClick={() => copyCode('FRESH50')}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 cursor-pointer backdrop-blur-md transition-colors flex items-center gap-2 text-xs font-bold select-none"
              >
                <Percent className="w-3.5 h-3.5 text-amber-300" />
                <span>Code: FRESH50 (50% OFF)</span>
                {copiedCode === 'FRESH50' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <span className="text-[10px] text-blue-200 uppercase underline">Copy</span>
                )}
              </motion.div>
            </div>
          </div>

          {/* Realistic 3D Laundry Showcase Graphic */}
          <div className="w-full md:w-auto flex items-center justify-center md:justify-end">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="relative w-48 h-48 sm:w-56 sm:h-56 bg-white/15 backdrop-blur-xl rounded-3xl p-3 border border-white/30 flex flex-col items-center justify-between shadow-2xl shadow-blue-950/20 group"
            >
              <div className="relative w-full h-36 sm:h-42 rounded-2xl overflow-hidden bg-white/40 shadow-inner">
                <img
                  src="/images/service_laundry.jpg"
                  alt="Modern CleanCare Washing"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white text-[9px] font-black tracking-wide uppercase backdrop-blur-md border border-white/20 shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Ozone</span>
                </div>
              </div>

              {/* Tag below graphic */}
              <span className="text-[11px] font-black text-white tracking-wide uppercase bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/25 flex items-center gap-1.5 shadow-xs">
                <span>100% Ozone Sanitized</span>
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── 3. Services Grid (2x2 on Mobile, 4-Cols on Desktop) ─────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base md:text-xl font-extrabold text-slate-900 tracking-tight">
              Select a Service
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Choose your garment treatment package
            </p>
          </div>

          <Link
            href="/book"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-5">
          {services.map((item, idx) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectService(item)}
              className={clsx(
                'group relative bg-white/85 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-sky-100/90 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between select-none shadow-xs',
                item.bgHover
              )}
            >
              <div>
                {/* Top Row: 3D Realistic Icon + Badge */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  {item.image ? (
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md shadow-sky-500/15 border border-sky-200/80 bg-white ring-2 ring-white/90 group-hover:scale-110 group-hover:shadow-sky-500/30 transition-all duration-300 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="relative w-14 h-14 rounded-2xl bg-white border border-sky-200/80 flex items-center justify-center shadow-md shadow-sky-500/15 group-hover:scale-110 group-hover:shadow-sky-500/30 transition-all duration-300 flex-shrink-0 ring-2 ring-white/90">
                      {item.icon}
                    </div>
                  )}

                  <span className={clsx('text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs', item.badgeColor)}>
                    {item.badge}
                  </span>
                </div>

                {/* Name & Desc */}
                <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-1 line-clamp-2 leading-snug">
                  {item.desc}
                </p>
              </div>

              {/* Bottom: Price & Turnaround pill */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900">{item.price}</span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-500" />
                  {item.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 4. Live Recent Order Status (Interactive Progress Bar) ───────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base md:text-xl font-extrabold text-slate-900 tracking-tight">
              Active Order Tracker
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <Link
            href="/orders"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            All Orders <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-white/85 backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-sky-100/90 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm md:text-base font-black text-slate-900">
                  ORD-20260922-001
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  In Processing
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                12 Items (4 Shirts, 2 Trousers, 1 Saree, 5 Daily) • ₹1,240 Total
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left md:text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Estimated Delivery
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                  Tomorrow, 24 Sep • 6:00 PM
                </span>
              </div>

              <Link
                href="/orders/ORD-20260922-001"
                className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                <span>Track Live</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Stepper Progress Steps */}
          <div className="pt-4 overflow-x-auto scrollbar-hide">
            <div className="flex items-center justify-between min-w-[500px]">
              {[
                { label: 'Booked', status: 'done', time: '10:30 AM' },
                { label: 'Picked Up', status: 'done', time: '01:20 PM' },
                { label: 'Received', status: 'done', time: '03:15 PM' },
                { label: 'Processing', status: 'active', time: 'In Progress' },
                { label: 'QC & Pack', status: 'pending', time: 'Pending' },
                { label: 'Out for Delivery', status: 'pending', time: 'Tomorrow' },
                { label: 'Delivered', status: 'pending', time: '6:00 PM' },
              ].map((step, idx, arr) => (
                <div key={step.label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={clsx(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all shadow-xs',
                      step.status === 'done' && 'bg-emerald-600 text-white ring-4 ring-emerald-50',
                      step.status === 'active' && 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse',
                      step.status === 'pending' && 'bg-slate-100 text-slate-400'
                    )}>
                      {step.status === 'done' ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <span className={clsx(
                      'text-[10px] font-bold mt-1 text-center whitespace-nowrap',
                      step.status === 'active' ? 'text-blue-600' : 'text-slate-600'
                    )}>
                      {step.label}
                    </span>
                  </div>

                  {idx < arr.length - 1 && (
                    <div className={clsx(
                      'flex-1 h-1 mx-2 rounded-full',
                      step.status === 'done' ? 'bg-emerald-500' : 'bg-slate-200'
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── 5. Popular Garments 1-Tap Quick Book Carousel ───────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base md:text-xl font-extrabold text-slate-900 tracking-tight">
              Popular Items
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              1-Tap add common clothes directly to your laundry bag
            </p>
          </div>

          <Link
            href="/book/garments"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>Custom List</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularGarments.map((g) => {
            const count = quickCounts[g.id] || 0;
            return (
              <motion.div
                key={g.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="group bg-white/85 backdrop-blur-xl p-3.5 rounded-2xl border border-sky-100/90 shadow-xs hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between select-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-white to-sky-50/70 border border-sky-100/80 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:shadow-md transition-all duration-300 flex-shrink-0 ring-1 ring-white/90">
                      {g.icon}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 bg-slate-100/90 px-2 py-0.5 rounded-full border border-slate-200/50">
                      {g.tag}
                    </span>
                  </div>

                  <p className="text-xs font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {g.name}
                  </p>
                  <p className="text-xs font-black text-blue-600 mt-1">
                    ₹{g.price}
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuickAdd(g)}
                  className={clsx(
                    'w-full mt-3 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-xs',
                    count > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700'
                  )}
                >
                  <Plus className="w-3 h-3" />
                  <span>{count > 0 ? `Added (${count})` : 'Add'}</span>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── 6. Why CleanCare Quality Promises (Trust Section with 3D Badges) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <motion.div whileHover={{ y: -3, scale: 1.02 }} className="bg-white/85 backdrop-blur-xl p-4 rounded-3xl border border-sky-100/90 shadow-xs flex items-start gap-3.5 group hover:border-blue-300 hover:shadow-md transition-all">
          <RealisticShieldBadge className="w-11 h-11 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
          <div>
            <h4 className="text-xs font-black text-slate-900">Fabric Health</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">Gentle ozone cleaning without shrinkage</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3, scale: 1.02 }} className="bg-white/85 backdrop-blur-xl p-4 rounded-3xl border border-sky-100/90 shadow-xs flex items-start gap-3.5 group hover:border-blue-300 hover:shadow-md transition-all">
          <RealisticVanBadge className="w-11 h-11 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
          <div>
            <h4 className="text-xs font-black text-slate-900">Free Pickup</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">30-min doorstep pickup across Jaipur</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3, scale: 1.02 }} className="bg-white/85 backdrop-blur-xl p-4 rounded-3xl border border-sky-100/90 shadow-xs flex items-start gap-3.5 group hover:border-blue-300 hover:shadow-md transition-all">
          <RealisticClockBadge className="w-11 h-11 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
          <div>
            <h4 className="text-xs font-black text-slate-900">Express 24h</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">Guaranteed on-time delivery promise</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3, scale: 1.02 }} className="bg-white/85 backdrop-blur-xl p-4 rounded-3xl border border-sky-100/90 shadow-xs flex items-start gap-3.5 group hover:border-blue-300 hover:shadow-md transition-all">
          <RealisticMedalBadge className="w-11 h-11 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
          <div>
            <h4 className="text-xs font-black text-slate-900">4.9 ★ Rating</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">12,400+ satisfied Jaipur households</p>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
