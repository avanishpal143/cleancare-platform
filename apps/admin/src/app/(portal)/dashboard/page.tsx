'use client';

import { useState, useEffect } from 'react';
import {
  FileText, Clock, Truck, TrendingUp, MessageSquare, AlertTriangle,
  ChevronRight, RefreshCw, Calendar, ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import axios from 'axios';
import {
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://cleancare-platform.onrender.com/api';

function authH() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('cc_admin_token') : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// Custom tooltip for line chart
function CustomLineTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs shadow-lg font-medium">
        <p className="text-slate-300">{label}</p>
        <p className="text-blue-400 font-bold">{payload[0].value} Orders</p>
      </div>
    );
  }
  return null;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState({
    totalOrders: 128,
    ordersGrowth: 12,
    inProcessing: 46,
    processingGrowth: 8,
    readyForDelivery: 31,
    deliveryGrowth: 5,
    revenue: 84620,
    revenueGrowth: 18,
    complaints: 12,
    complaintsGrowth: -4,
    exceptions: 5,
    exceptionsGrowth: -17,
  });

  const [chartData, setChartData] = useState([
    { date: '16 Sep', orders: 120 },
    { date: '17 Sep', orders: 135 },
    { date: '18 Sep', orders: 110 },
    { date: '19 Sep', orders: 155 },
    { date: '20 Sep', orders: 140 },
    { date: '21 Sep', orders: 190 },
    { date: '22 Sep', orders: 165 },
  ]);

  const [statusDistribution, setStatusDistribution] = useState([
    { name: 'Booked', count: 20, color: '#3b82f6' },
    { name: 'Picked Up', count: 18, color: '#0ea5e9' },
    { name: 'Processing', count: 46, color: '#2563eb' },
    { name: 'QC', count: 12, color: '#f59e0b' },
    { name: 'Ready for Delivery', count: 20, color: '#10b981' },
    { name: 'Delivered', count: 12, color: '#22c55e' },
  ]);

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'ORD-001',
      orderNumber: 'ORD-001',
      customerName: 'Rahul Sharma',
      mobile: '+91 98765 43210',
      items: 8,
      amount: 1240,
      status: 'PROCESSING',
      createdAt: '22 Sep 10:30',
    },
    {
      id: 'ORD-002',
      orderNumber: 'ORD-002',
      customerName: 'Priya Singh',
      mobile: '+91 98765 11111',
      items: 10,
      amount: 860,
      status: 'OUT_FOR_DELIVERY',
      createdAt: '22 Sep 09:15',
    },
    {
      id: 'ORD-003',
      orderNumber: 'ORD-003',
      customerName: 'Amit Verma',
      mobile: '+91 98765 22222',
      items: 6,
      amount: 740,
      status: 'RECEIVED',
      createdAt: '22 Sep 08:20',
    },
    {
      id: 'ORD-004',
      orderNumber: 'ORD-004',
      customerName: 'Neha Jain',
      mobile: '+91 98765 33333',
      items: 12,
      amount: 1520,
      status: 'QC',
      createdAt: '21 Sep 06:40',
    },
    {
      id: 'ORD-005',
      orderNumber: 'ORD-005',
      customerName: 'Suresh Kumar',
      mobile: '+91 98765 55555',
      items: 5,
      amount: 620,
      status: 'DELIVERED',
      createdAt: '21 Sep 05:10',
    },
  ]);

  const fetchData = async () => {
    try {
      const [k, c, d, r] = await Promise.all([
        axios.get(`${API}/reports/dashboard`, { headers: authH() }),
        axios.get(`${API}/reports/orders-chart?days=7`, { headers: authH() }),
        axios.get(`${API}/reports/order-status-distribution`, { headers: authH() }),
        axios.get(`${API}/reports/recent-orders?limit=5`, { headers: authH() }),
      ]);

      if (k.data?.data) {
        setKpiData((prev) => ({
          ...prev,
          totalOrders: k.data.data.totalOrders ?? prev.totalOrders,
          inProcessing: k.data.data.inProcessing ?? prev.inProcessing,
          readyForDelivery: k.data.data.readyForDelivery ?? prev.readyForDelivery,
          revenue: k.data.data.revenue ?? prev.revenue,
          complaints: k.data.data.complaints ?? prev.complaints,
          exceptions: k.data.data.exceptions ?? prev.exceptions,
        }));
      }
      if (c.data?.data?.length) {
        setChartData(c.data.data);
      }
      if (d.data?.data?.length) {
        // map backend statuses
        const mapColor: Record<string, string> = {
          BOOKED: '#3b82f6',
          PICKED_UP: '#0ea5e9',
          PROCESSING: '#2563eb',
          QC: '#f59e0b',
          READY_FOR_DELIVERY: '#10b981',
          DELIVERED: '#22c55e',
        };
        const mapped = d.data.data.map((item: any) => ({
          name: item.status.replace(/_/g, ' '),
          count: item.count,
          color: mapColor[item.status] || '#64748b',
        }));
        setStatusDistribution(mapped);
      }
      if (r.data?.data?.length) {
        setRecentOrders(
          r.data.data.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            customerName: o.customer?.name ?? 'Customer',
            mobile: o.customer?.mobile ?? '',
            items: o.garmentCount ?? 0,
            amount: o.totalAmount ?? 0,
            status: o.status,
            createdAt: new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          }))
        );
      }
    } catch (err) {
      // Use fallback seed data for preview
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalStatusCount = statusDistribution.reduce((acc, curr) => acc + curr.count, 0);

  // Status badge styling matching exact image
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">
            Processing
          </span>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            Out for Delivery
          </span>
        );
      case 'RECEIVED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
            Received
          </span>
        );
      case 'QC':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            QC
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">
            Delivered
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>22 Sep 2026 - 22 Sep 2026</span>
          </div>
          <button
            onClick={fetchData}
            className="p-2 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-600 shadow-sm transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className={clsx('w-4 h-4', loading && 'animate-spin text-blue-600')} />
          </button>
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Total Orders */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-none">{kpiData.totalOrders}</p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-2 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {kpiData.ordersGrowth}%
            </p>
          </div>
        </div>

        {/* Card 2: In Processing */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">In Processing</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-none">{kpiData.inProcessing}</p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-2 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {kpiData.processingGrowth}%
            </p>
          </div>
        </div>

        {/* Card 3: Ready for Delivery */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Ready for Delivery</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-none">{kpiData.readyForDelivery}</p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-2 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {kpiData.deliveryGrowth}%
            </p>
          </div>
        </div>

        {/* Card 4: Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Revenue (This Month)</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-none">
              ₹{kpiData.revenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-2 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {kpiData.revenueGrowth}%
            </p>
          </div>
        </div>

        {/* Card 5: Complaints */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Complaints</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-none">{kpiData.complaints}</p>
            <p className="text-[11px] font-semibold text-rose-500 mt-2 flex items-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" /> {Math.abs(kpiData.complaintsGrowth)}%
            </p>
          </div>
        </div>

        {/* Card 6: Exceptions */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Exceptions</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-none">{kpiData.exceptions}</p>
            <p className="text-[11px] font-semibold text-rose-500 mt-2 flex items-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" /> {Math.abs(kpiData.exceptionsGrowth)}%
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Order Overview Line Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800">Order Overview</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-3 h-0.5 bg-blue-600 rounded-full" />
              <span>Orders</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[0, 300]} ticks={[0, 100, 200, 300]} />
                <Tooltip content={<CustomLineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#2563EB', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                  activeDot={{ r: 5, fill: '#2563EB' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Order Status Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Order Status</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Donut with center text */}
            <div className="relative w-44 h-44 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-slate-900 leading-none">{totalStatusCount}</span>
                <span className="text-[10px] font-semibold text-slate-400 mt-1">Total Orders</span>
              </div>
            </div>

            {/* Status Legend list */}
            <div className="flex-1 w-full space-y-2">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">Recent Orders</h2>
          <Link
            href="/orders"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">Order #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Items</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-800 font-mono">
                    <Link href={`/orders`} className="hover:text-blue-600">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 font-medium">
                    {order.items}
                  </td>
                  <td className="px-6 py-3.5 font-bold text-slate-900">
                    ₹{order.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-3.5">
                    {renderStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-3.5 text-slate-400">
                    {order.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
