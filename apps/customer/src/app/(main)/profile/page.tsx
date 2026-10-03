'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, MapPin, ShoppingBag, CreditCard, Bell,
  HelpCircle, Info, LogOut, ChevronRight, Edit2,
  Shield, Gift, Phone
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { generateInitials } from '@/lib/utils';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const MENU_SECTIONS = [
  {
    title: 'Account & Orders',
    items: [
      { icon: ShoppingBag, label: 'Order History & Invoices', href: '/orders' },
      { icon: MapPin,      label: 'Saved Addresses',          href: '/book/pickup' },
      { icon: Gift,        label: 'Offers & Discounts',       href: '/offers' },
      { icon: CreditCard,  label: 'Payment Methods',          href: '/orders' },
    ],
  },
  {
    title: 'Support & Legal',
    items: [
      { icon: Phone,       label: 'Customer Care Hotline',    href: 'tel:+919876543210' },
      { icon: HelpCircle,  label: 'FAQs & Cleaning Guide',    href: '/support' },
      { icon: Shield,      label: 'Fabric Safety Guarantee',  href: '/privacy' },
      { icon: Info,        label: 'About CleanCare Jaipur',   href: '/about' },
    ],
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { customer, user, logout } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.replace('/login');
  };

  const name = customer?.name ?? user?.name ?? 'Satyanarayan';
  const mobile = customer?.mobile ?? user?.mobile ?? '9876543210';
  const email = customer?.email ?? 'satyanarayan@example.com';
  const initials = generateInitials(name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
          Customer Profile
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage your personal details, saved addresses & preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 1 Col: User Identity Card */}
        <div className="space-y-4">
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-sky-100/90 shadow-sm text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-md shadow-blue-500/20 mb-4 ring-4 ring-blue-50">
              {initials}
            </div>

            <h2 className="text-lg font-black text-slate-900 tracking-tight">{name}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">+91 {mobile}</p>
            <p className="text-xs text-slate-400 font-medium">{email}</p>

            <div className="mt-4 pt-4 border-t border-slate-100 w-full flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">CleanCare Member</span>
              <span className="font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                Gold Tier ⭐
              </span>
            </div>
          </motion.div>

          {/* Logout Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-3.5 rounded-2xl bg-rose-50/80 hover:bg-rose-100 text-rose-600 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 border border-rose-100/80 backdrop-blur-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout from Account</span>
          </motion.button>
        </div>

        {/* Right 2 Cols: Menu Sections */}
        <div className="md:col-span-2 space-y-6">
          {MENU_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                {section.title}
              </h3>
              <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-sky-100/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {section.items.map(({ icon: Icon, label, href }) => (
                  <motion.button
                    key={label}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => href.startsWith('tel:') ? (window.location.href = href) : router.push(href)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors group select-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-800">{label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Sign Out</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to log out from your CleanCare customer account?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md shadow-rose-500/20 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
