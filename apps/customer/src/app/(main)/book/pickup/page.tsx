'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useBookingStore } from '@/store/bookingStore';
import { motion } from 'framer-motion';

export default function PickupDeliveryPage() {
  const router = useRouter();
  const {
    setPickupAddress, setDeliveryAddress,
    setPickupDate, setPickupSlot,
  } = useBookingStore();

  const [pickupAddr, setPickupAddr] = useState({
    id: 'addr-1',
    label: 'Home',
    line1: '123, Mansarovar',
    city: 'Jaipur',
    pincode: '302020',
  });

  const [deliveryAddr, setDeliveryAddr] = useState({
    id: 'addr-2',
    label: 'Home',
    line1: '123, Mansarovar',
    city: 'Jaipur',
    pincode: '302020',
  });

  const [date, setDate] = useState('Thu, 24 Sep 2026');
  const [selectedSlot, setSelectedSlot] = useState('10 AM - 12 PM');

  const slots = ['10 AM - 12 PM', '12 PM - 2 PM', '4 PM - 6 PM'];

  const handleNext = () => {
    setPickupAddress({
      id: pickupAddr.id,
      customerId: 'cmunt4cs00001',
      label: pickupAddr.label,
      line1: pickupAddr.line1,
      line2: null,
      city: pickupAddr.city,
      state: 'Rajasthan',
      pincode: pickupAddr.pincode,
      isDefault: true,
      lat: null,
      lng: null,
    });
    setDeliveryAddress({
      id: deliveryAddr.id,
      customerId: 'cmunt4cs00001',
      label: deliveryAddr.label,
      line1: deliveryAddr.line1,
      line2: null,
      city: deliveryAddr.city,
      state: 'Rajasthan',
      pincode: deliveryAddr.pincode,
      isDefault: true,
      lat: null,
      lng: null,
    });
    setPickupDate('2026-09-24');
    setPickupSlot(selectedSlot);
    router.push('/book/review');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col justify-between bg-white h-full p-4 sm:p-6 overflow-hidden select-none"
    >
      {/* ── Top Header (Matching Screen 5) ──────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 pb-3 border-b border-slate-100">
        <Link
          href="/book/garments"
          className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors border border-slate-100 shadow-xs"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            Pickup & Delivery
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Select addresses and scheduled slot</p>
        </div>
      </div>

      {/* ── Middle: Addresses & Slot (Fits without scrolling) ───────────── */}
      <div className="flex-1 overflow-y-auto my-auto space-y-3.5 py-2">
        {/* Pickup Address Card */}
        <div className="space-y-1.5">
          <p className="text-xs font-black text-slate-700">Pickup Address</p>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start justify-between">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-black text-slate-900">{pickupAddr.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  {pickupAddr.line1}, {pickupAddr.city} {pickupAddr.pincode}
                </p>
              </div>
            </div>
            <button
              onClick={() => alert('Change address')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex-shrink-0"
            >
              Change
            </button>
          </div>
        </div>

        {/* Delivery Address Card */}
        <div className="space-y-1.5">
          <p className="text-xs font-black text-slate-700">Delivery Address</p>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start justify-between">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-black text-slate-900">{deliveryAddr.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  {deliveryAddr.line1}, {deliveryAddr.city} {deliveryAddr.pincode}
                </p>
              </div>
            </div>
            <button
              onClick={() => alert('Change address')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex-shrink-0"
            >
              Change
            </button>
          </div>
        </div>

        {/* Pickup Date Card */}
        <div className="space-y-1.5">
          <p className="text-xs font-black text-slate-700">Pickup Date</p>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">{date}</span>
          </div>
        </div>

        {/* Pickup Time Slot */}
        <div className="space-y-1.5">
          <p className="text-xs font-black text-slate-700">Pickup Time Slot</p>
          <div className="grid grid-cols-3 gap-2.5">
            {slots.map((slot) => {
              const isSelected = selectedSlot === slot;
              return (
                <motion.button
                  key={slot}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSlot(slot)}
                  className={clsx(
                    'py-3 px-2 rounded-2xl text-[11px] font-black transition-all text-center border',
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  )}
                >
                  {slot}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom: Next Button (Cleanly docked) ────────────────────────── */}
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
