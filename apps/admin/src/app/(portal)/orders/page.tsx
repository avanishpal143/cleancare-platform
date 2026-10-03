'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, Download, ChevronRight, X } from 'lucide-react';
import { clsx } from 'clsx';
import axios from 'axios';
import { format } from 'date-fns';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://cleancare-platform.onrender.com/api';
function authH() { const t = localStorage.getItem('cc_admin_token'); return t ? { Authorization: `Bearer ${t}` } : {}; }

const STATUS_OPTS = ['','BOOKED','PICKUP_ASSIGNED','PICKED_UP','RECEIVED','PROCESSING','QC','PACKED','READY_FOR_DELIVERY','OUT_FOR_DELIVERY','DELIVERED','COMPLETED','CANCELLED'];
const PAYMENT_OPTS = ['','PENDING','PAID','FAILED','REFUNDED'];

const STATUS_CHIP: Record<string,string> = {
  BOOKED:'chip-blue', PICKUP_ASSIGNED:'chip-amber', PICKED_UP:'chip-amber',
  RECEIVED:'chip-purple', PROCESSING:'chip-amber', QC:'chip-purple',
  PACKED:'chip-green', READY_FOR_DELIVERY:'chip-green', OUT_FOR_DELIVERY:'chip-orange',
  DELIVERED:'chip-green', COMPLETED:'chip-green', CANCELLED:'chip-red',
};
const STATUS_LABEL: Record<string,string> = {
  BOOKED:'Booked', PICKUP_ASSIGNED:'Pickup Assigned', PICKED_UP:'Picked Up',
  RECEIVED:'Received', PROCESSING:'Processing', QC:'QC', PACKED:'Packed',
  READY_FOR_DELIVERY:'Ready', OUT_FOR_DELIVERY:'Out for Delivery',
  DELIVERED:'Delivered', COMPLETED:'Completed', CANCELLED:'Cancelled',
};

export default function OrdersPage() {
  const [orders,  setOrders]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const limit = 20;

  const [search,        setSearch]        = useState('');
  const [statusFilter,  setStatusFilter]  = useState('');
  const [payFilter,     setPayFilter]     = useState('');
  const [dateFrom,      setDateFrom]      = useState('');
  const [dateTo,        setDateTo]        = useState('');

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params: any = { page: p, limit };
      if (search)       params.search       = search;
      if (statusFilter) params.status       = statusFilter;
      if (payFilter)    params.paymentStatus= payFilter;
      if (dateFrom)     params.dateFrom     = dateFrom;
      if (dateTo)       params.dateTo       = dateTo;

      const { data } = await axios.get(`${API}/orders`, { params, headers: authH() });
      setOrders(data.data?.items ?? []);
      setTotal(data.data?.total ?? 0);
      setPage(p);
    } catch { } finally { setLoading(false); }
  }, [search, statusFilter, payFilter, dateFrom, dateTo]);

  useEffect(() => { load(1); }, [search, statusFilter, payFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(total / limit);

  const handleExport = () => {
    const csv = [
      ['Order #','Customer','Mobile','Service','Status','Amount','Payment','Date'].join(','),
      ...orders.map((o) => [
        o.orderNumber, o.customer?.name, o.customer?.mobile,
        o.service?.name, o.status, o.totalAmount, o.paymentStatus,
        format(new Date(o.createdAt), 'yyyy-MM-dd'),
      ].join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `orders-${format(new Date(),'yyyyMMdd')}.csv`; a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-desc">{total.toLocaleString()} total orders</p>
        </div>
        <button onClick={handleExport} className="btn btn-outline btn-md gap-1.5">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card p-3 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Order #, customer..." className="input pl-8 h-8 text-xs" />
          {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X className="w-3 h-3 text-slate-400" /></button>}
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input h-8 text-xs w-44">
          <option value="">All Statuses</option>
          {STATUS_OPTS.filter(Boolean).map((s) => <option key={s} value={s}>{STATUS_LABEL[s] ?? s}</option>)}
        </select>

        <select value={payFilter} onChange={(e) => setPayFilter(e.target.value)} className="input h-8 text-xs w-36">
          <option value="">All Payments</option>
          {PAYMENT_OPTS.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input h-8 text-xs w-36" placeholder="From" />
        <input type="date" value={dateTo}   onChange={(e) => setDateTo(e.target.value)}   className="input h-8 text-xs w-36" placeholder="To" />

        {(search || statusFilter || payFilter || dateFrom || dateTo) && (
          <button onClick={() => { setSearch(''); setStatusFilter(''); setPayFilter(''); setDateFrom(''); setDateTo(''); }} className="btn btn-ghost btn-sm text-red-500">Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>{['Order #','Customer','Area','Service','Items','Amount','Payment','Status','Date','Actions'].map((h) => <th key={h} className="th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(8)].map((_,i) => (
                <tr key={i} className="tr">{[...Array(10)].map((_,j) => <td key={j} className="td"><div className="h-3.5 bg-slate-100 rounded animate-pulse" /></td>)}</tr>
              ))
            ) : orders.length === 0 ? (
              <tr><td colSpan={10} className="td text-center py-12 text-slate-400">No orders found</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="tr">
                  <td className="td"><span className="font-mono text-xs font-bold text-blue-700">{o.orderNumber}</span></td>
                  <td className="td">
                    <p className="font-medium text-slate-800 text-xs">{o.customer?.name}</p>
                    <p className="text-slate-400 text-xs">{o.customer?.mobile}</p>
                  </td>
                  <td className="td text-xs text-slate-500">{o.pickupAddress?.city ?? '—'}</td>
                  <td className="td text-xs">{o.service?.name}</td>
                  <td className="td text-center">{o.garmentCount}</td>
                  <td className="td font-semibold text-xs">₹{o.totalAmount}</td>
                  <td className="td">
                    <span className={clsx('chip', o.paymentStatus === 'PAID' ? 'chip-green' : o.paymentStatus === 'FAILED' ? 'chip-red' : 'chip-amber')}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="td"><span className={clsx('chip', STATUS_CHIP[o.status] ?? 'chip-gray')}>{STATUS_LABEL[o.status] ?? o.status}</span></td>
                  <td className="td text-xs text-slate-500">{format(new Date(o.createdAt),'dd MMM')}</td>
                  <td className="td">
                    <Link href={`/orders/${o.id}`} className="btn btn-ghost btn-xs text-blue-600">View</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">Showing {(page-1)*limit+1}–{Math.min(page*limit,total)} of {total}</p>
            <div className="flex gap-1">
              <button onClick={() => load(page-1)} disabled={page === 1} className="btn btn-outline btn-xs">Prev</button>
              {[...Array(Math.min(5, totalPages))].map((_,i) => {
                const p = Math.max(1, page - 2) + i;
                return p <= totalPages ? (
                  <button key={p} onClick={() => load(p)} className={clsx('btn btn-xs', p === page ? 'btn-primary' : 'btn-outline')}>{p}</button>
                ) : null;
              })}
              <button onClick={() => load(page+1)} disabled={page >= totalPages} className="btn btn-outline btn-xs">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
