'use client';

import { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Percent, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const coupons = [
    {
      code: 'FIRST50',
      discount: '50% OFF',
      title: 'Welcome First Order Offer',
      desc: 'Get flat 50% discount (up to ₹150) on your very first laundry or dry cleaning pickup.',
      expiry: 'Valid till 31 Oct 2026',
      badge: 'HOT DEAL',
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      code: 'SPECIAL100',
      discount: '₹100 OFF',
      title: 'Special Fabric Care',
      desc: 'Applicable on dry cleaning of Silk Sarees, Tuxedos, Blazers and Heavy Woolens.',
      expiry: 'Valid on orders above ₹699',
      badge: 'POPULAR',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      code: 'FREESHIP',
      discount: 'FREE DELIVERY',
      title: 'Zero Delivery Fee',
      desc: 'Enjoy free doorstep pickup & drop for all scheduled weekly orders in Jaipur.',
      expiry: 'Valid on orders above ₹399',
      badge: 'DELIVERY',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
          Offers & Promo Deals
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Exclusive discounts & cashback codes for your laundry orders
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {coupons.map((c, idx) => (
          <motion.div
            key={c.code}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-sky-100/90 shadow-sm hover:border-blue-300 hover:shadow-xl transition-all flex flex-col justify-between select-none"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {c.discount}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${c.badgeColor}`}>
                  {c.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">{c.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{c.desc}</p>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">{c.expiry}</span>
                <span className="text-xs font-black text-slate-800 font-mono tracking-wider">{c.code}</span>
              </div>

              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => handleCopy(c.code)}
                className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                {copiedCode === c.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
