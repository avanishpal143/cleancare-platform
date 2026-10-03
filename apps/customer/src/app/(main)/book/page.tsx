'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useBookingStore } from '@/store/bookingStore';
import { motion, AnimatePresence } from 'framer-motion';
import { RealisticSteamPressIcon, RealisticSpecialCareIcon } from '@/components/RealisticIcons';

const SERVICES = [
  {
    id: 'cmunt4csc000n103txahzpohl',
    name: 'Dry Cleaning',
    slug: 'dry-cleaning',
    desc: 'Suits, sarees, silks & delicate blazer care',
    price: 50,
    tag: 'Suits & Silk',
    image: '/images/service_dry_clean.jpg',
    icon: null,
  },
  {
    id: 'cmunt4csr000o103tn0ky0r9y',
    name: 'Laundry',
    slug: 'laundry',
    desc: 'Everyday wash, sanitize with eco-detergents & fold',
    price: 40,
    tag: 'Daily Need',
    image: '/images/service_laundry.jpg',
    icon: null,
  },
  {
    id: 'cmunt4css000p103t5k0222a4',
    name: 'Steam Press',
    slug: 'ironing',
    desc: 'Crisp, wrinkle-free steam ironing on hangers',
    price: 20,
    tag: 'Same Day',
    image: null,
    icon: <RealisticSteamPressIcon className="w-9 h-9" />,
  },
  {
    id: 'cmunt4csv000t103twur73wv1',
    name: 'Special Care',
    slug: 'special-care',
    desc: 'Bridal wear, heavy lehengas, woolens & quilts',
    price: 120,
    tag: 'Luxury',
    image: null,
    icon: <RealisticSpecialCareIcon className="w-9 h-9" />,
  },
];

export default function BookServicePage() {
  const router = useRouter();
  const { selectedService, setService } = useBookingStore();

  const [selectedSlug, setSelectedSlug] = useState(selectedService?.slug || 'dry-cleaning');

  const handleNext = () => {
    const found = SERVICES.find(s => s.slug === selectedSlug) || SERVICES[0];
    setService({
      id: found.id,
      name: found.name,
      slug: found.slug,
      description: found.desc,
      iconUrl: null,
      imageUrl: null,
      unit: 'PER_ITEM',
      basePrice: found.price,
      turnaroundDays: 2,
      minOrderValue: 0,
      isActive: true,
      sortOrder: 1,
      createdAt: '',
      updatedAt: '',
      deletedAt: null,
    });
    router.push('/book/garments');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex-1 flex flex-col justify-between bg-white h-full p-4 sm:p-6 overflow-hidden select-none"
    >
      {/* ── Top Header & Stepper (Single clean header, matching Screen 3) ── */}
      <div className="shrink-0 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors border border-slate-100 shadow-xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            Book a Service
          </h1>
        </div>

        {/* 5-Step Progress Stepper matching Screen 3 */}
        <div className="pt-0.5 pb-0.5">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Service', active: true, done: false },
              { step: 2, label: 'Garments', active: false, done: false },
              { step: 3, label: 'Address', active: false, done: false },
              { step: 4, label: 'Slot', active: false, done: false },
              { step: 5, label: 'Confirm', active: false, done: false },
            ].map((item, idx, arr) => (
              <div key={item.step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all shadow-xs',
                      item.active
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-50 scale-110'
                        : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    {item.step}
                  </div>
                  <span className={clsx('text-[10px] font-bold mt-1 tracking-tight', item.active ? 'text-blue-600' : 'text-slate-400')}>
                    {item.label}
                  </span>
                </div>

                {idx < arr.length - 1 && (
                  <div className="flex-1 h-0.5 bg-slate-200 mx-1.5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section Title */}
        <div className="pt-1">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
            Select Service
          </h2>
        </div>
      </div>

      {/* ── Middle: 4 Service Radio Cards (Matching Screen 3) ────────────── */}
      <div className="flex-1 my-auto py-2 space-y-2.5 overflow-y-auto pr-0.5">
        {SERVICES.map((item) => {
          const isSelected = selectedSlug === item.slug;
          return (
            <motion.div
              key={item.slug}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSlug(item.slug)}
              className={clsx(
                'p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between select-none shadow-xs',
                isSelected
                  ? 'border-blue-600 bg-blue-50/60 shadow-md shadow-blue-500/10'
                  : 'border-slate-200/80 bg-white hover:border-slate-300'
              )}
            >
              <div className="flex items-center gap-3">
                {/* Radio Indicator */}
                <div
                  className={clsx(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                    isSelected ? 'border-blue-600 bg-blue-600 shadow-xs' : 'border-slate-300 bg-white'
                  )}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                {/* Realistic 3D Thumbnail / Icon */}
                {item.image ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-sky-200/80 bg-white shadow-xs flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-white border border-sky-200/80 flex items-center justify-center shadow-xs flex-shrink-0">
                    {item.icon}
                  </div>
                )}

                {/* Title & Description */}
                <div>
                  <div className="flex items-center gap-2">
                    <p className={clsx('text-xs sm:text-sm font-black', isSelected ? 'text-blue-950' : 'text-slate-900')}>
                      {item.name}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 bg-white/80 px-2 py-0.5 rounded-full border border-slate-100">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">{item.desc}</p>
                </div>
              </div>

              <span className="text-xs font-black text-blue-600 font-mono">
                ₹{item.price}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* ── Bottom: Next Button (Docked cleanly, NO bottom nav overlap) ─── */}
      <div className="shrink-0 pt-3 pb-1 border-t border-slate-100">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full py-3.5 sm:py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all text-center flex items-center justify-center gap-2"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
