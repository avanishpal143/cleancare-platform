'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://cleancare-platform.onrender.com/api';

function authHeaders() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('cc_driver_token') : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

type Tab = 'ALL' | 'PICKUP' | 'DELIVERY';

function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'ALL';

  const [tab, setTab] = useState<Tab>(initialTab);

  const [loading, setLoading] = useState(false);

  // Default seed jobs matching reference image
  const [jobs, setJobs] = useState<any[]>([
    {
      id: 'ORD-001',
      orderNumber: 'ORD-001',
      jobType: 'PICKUP',
      customerName: 'Rahul Sharma',
      mobile: '+91 98765 43210',
      address: '123, Mansarovar, Jaipur',
      timeSlot: '10:00 AM - 12:00 PM',
      garmentCount: 8,
      status: 'ASSIGNED',
    },
    {
      id: 'ORD-002',
      orderNumber: 'ORD-002',
      jobType: 'DELIVERY',
      customerName: 'Priya Singh',
      mobile: '+91 98765 11111',
      address: 'Vaishali Nagar, Jaipur',
      timeSlot: '12:00 PM - 2:00 PM',
      garmentCount: 10,
      status: 'ASSIGNED',
    },
    {
      id: 'ORD-003',
      orderNumber: 'ORD-003',
      jobType: 'PICKUP',
      customerName: 'Amit Verma',
      mobile: '+91 98765 22222',
      address: 'C-Scheme, Jaipur',
      timeSlot: '02:00 PM - 04:00 PM',
      garmentCount: 6,
      status: 'ASSIGNED',
    },
  ]);

  useEffect(() => {
    axios.get(`${API}/drivers/me/jobs`, { headers: authHeaders() })
      .then((r) => {
        if (r.data?.data?.length) {
          const mapped = r.data.data.map((j: any) => ({
            id: j.id || j.order?.id,
            orderNumber: j.order?.orderNumber || 'ORD-001',
            jobType: j.jobType || (j.type === 'DELIVERY' ? 'DELIVERY' : 'PICKUP'),
            customerName: j.order?.customer?.name || 'Customer',
            mobile: j.order?.customer?.mobile || '+91 98765 43210',
            address: j.order?.pickupAddress?.line1 ? `${j.order.pickupAddress.line1}, ${j.order.pickupAddress.city}` : '123, Mansarovar, Jaipur',
            timeSlot: j.order?.pickupSlotLabel || '10:00 AM - 12:00 PM',
            garmentCount: j.order?.garmentCount || 8,
            status: j.status,
          }));
          setJobs(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const pickups = jobs.filter((j) => j.jobType === 'PICKUP');
  const deliveries = jobs.filter((j) => j.jobType === 'DELIVERY');
  const displayed = tab === 'ALL' ? jobs : tab === 'PICKUP' ? pickups : deliveries;

  const handleNavigate = (address: string) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">

      {/* Header with Back Arrow and Title */}
      <header className="bg-white px-5 pt-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Today's Jobs</h1>
        </div>

        {/* Filter Tabs matching reference image */}
        <div className="flex gap-2">
          {(
            [
              ['ALL', `All (${jobs.length})`],
              ['PICKUP', `Pickups (${pickups.length})`],
              ['DELIVERY', `Deliveries (${deliveries.length})`],
            ] as [Tab, string][]
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center',
                tab === t
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Job Cards List */}
      <div className="flex-1 p-5 space-y-4 overflow-y-auto">
        {displayed.map((job) => {
          const isPickup = job.jobType === 'PICKUP';
          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)]"
            >
              {/* Order number & Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-extrabold text-slate-900 text-sm">{job.orderNumber}</span>
                <span
                  className={clsx(
                    'px-3 py-1 rounded-full text-[11px] font-bold',
                    isPickup
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  )}
                >
                  {isPickup ? 'Pickup' : 'Delivery'}
                </span>
              </div>

              {/* Customer details */}
              <div className="space-y-1 mb-3">
                <p className="font-bold text-slate-900 text-sm">{job.customerName}</p>
                <p className="text-xs text-slate-400 font-medium">{job.mobile}</p>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 mb-2 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{job.address}</span>
              </div>

              {/* Time slot */}
              <div className="flex items-center gap-2 mb-5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{job.timeSlot}</span>
              </div>

              {/* Action Buttons side-by-side */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavigate(job.address)}
                  className="flex-1 py-3 px-4 rounded-xl border border-blue-600 text-blue-600 font-bold text-xs hover:bg-blue-50 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" /> Navigate
                </button>

                <Link
                  href={isPickup ? `/pickup/${job.id}` : `/delivery/${job.id}`}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-500/20 active:scale-95 transition-all text-center"
                >
                  {isPickup ? 'Start Pickup' : 'Start Delivery'}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading jobs...</div>}>
      <JobsContent />
    </Suspense>
  );
}

