'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useBookingStore } from '@/store/bookingStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RealisticShirtIcon,
  RealisticPantsIcon,
  RealisticSuitIcon,
  RealisticSareeIcon,
  RealisticJacketIcon,
} from '@/components/RealisticIcons';

interface GarmentItem {
  id: string;
  name: string;
  category: string;
  price: number;
  qty: number;
  iconBg: string;
  icon: React.ReactNode;
}

export default function SelectGarmentsPage() {
  const router = useRouter();
  const { setItemQty, selectedService } = useBookingStore();

  const [garments, setGarments] = useState<GarmentItem[]>([
    {
      id: 'g1',
      name: 'Formal Shirt / Kurta',
      category: 'Men / Women',
      price: 60,
      qty: 2,
      iconBg: 'bg-white border-sky-100',
      icon: <RealisticShirtIcon className="w-8 h-8" />,
    },
    {
      id: 'g2',
      name: 'Trouser / Jeans',
      category: 'Bottom Wear',
      price: 70,
      qty: 1,
      iconBg: 'bg-white border-sky-100',
      icon: <RealisticPantsIcon className="w-8 h-8" />,
    },
    {
      id: 'g3',
      name: 'Suit 2-Piece / Blazer',
      category: 'Formal Wear',
      price: 150,
      qty: 0,
      iconBg: 'bg-white border-sky-100',
      icon: <RealisticSuitIcon className="w-8 h-8" />,
    },
    {
      id: 'g4',
      name: 'Designer Saree / Lehenga',
      category: 'Ethnic Delicate',
      price: 120,
      qty: 1,
      iconBg: 'bg-white border-sky-100',
      icon: <RealisticSareeIcon className="w-8 h-8" />,
    },
    {
      id: 'g5',
      name: 'Winter Jacket / Coat',
      category: 'Heavy Fabric',
      price: 100,
      qty: 0,
      iconBg: 'bg-white border-sky-100',
      icon: <RealisticJacketIcon className="w-8 h-8" />,
    },
  ]);

  const updateQty = (id: string, delta: number) => {
    setGarments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = Math.max(0, item.qty + delta);
          return { ...item, qty: nextQty };
        }
        return item;
      })
    );
  };

  const handleNext = () => {
    garments.forEach((g) => {
      if (g.qty > 0) {
        setItemQty(
          {
            id: g.id,
            serviceId: selectedService?.id || 'dry-cleaning',
            name: g.name,
            slug: g.id,
            unitPrice: g.price,
            minQty: 1,
            isActive: true,
            sortOrder: 1,
          },
          g.qty
        );

      }
    });
    router.push('/book/pickup');
  };

  const totalSelected = garments.reduce((acc, curr) => acc + curr.qty, 0);
  const totalAmount = garments.reduce((acc, curr) => acc + curr.qty * curr.price, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col justify-between bg-white h-full p-4 sm:p-6 overflow-hidden select-none"
    >
      {/* ── Top Header & Subheader (Matching Screen 4) ──────────────────── */}
      <div className="shrink-0">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Link
              href="/book"
              className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors border border-slate-100 shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                Select Garments
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Add garments and quantity</p>
            </div>
          </div>

          {totalSelected > 0 && (
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {totalSelected} Items • ₹{totalAmount}
            </span>
          )}
        </div>
      </div>

      {/* ── Garments List (Scrolls cleanly within allocated space) ───────── */}
      <div className="flex-1 my-3 space-y-2.5 overflow-y-auto pr-1">
        {garments.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.25 }}
            className={clsx(
              'p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between shadow-xs',
              item.qty > 0
                ? 'border-blue-400 bg-blue-50/30 ring-2 ring-blue-50'
                : 'border-slate-200/80 bg-white hover:border-slate-300'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 shadow-xs', item.iconBg)}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-tight">{item.name}</p>
                <p className="text-xs font-black text-slate-500 mt-0.5">₹{item.price}</p>
              </div>
            </div>

            {/* Stepper [- QTY +] */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => updateQty(item.id, -1)}
                disabled={item.qty === 0}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all font-bold"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </motion.button>

              <span className="w-6 text-center text-sm font-black text-slate-900">
                {item.qty}
              </span>

              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => updateQty(item.id, 1)}
                className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Bottom: Next Button (Cleanly docked) ────────────────────────── */}
      <div className="shrink-0 pt-3 pb-1 border-t border-slate-100">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={totalSelected === 0}
          className="w-full py-3.5 sm:py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all text-center flex items-center justify-center gap-2"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
