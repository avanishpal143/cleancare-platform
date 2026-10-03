'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Save, MapPin, Clock, Percent } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    businessName: 'CleanCare Laundry & Dry Cleaning',
    city: 'Jaipur',
    pincodes: '302020, 302021, 302001, 302015, 302017, 302019',
    gstRate: '18',
    deliveryFee: '50',
    minOrderValue: '199',
    defaultTurnaroundDays: '2',
    pickupSlots: '10:00 AM - 12:00 PM, 12:00 PM - 02:00 PM, 04:00 PM - 06:00 PM',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configuration rules saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Settings & Rules</h1>
        <p className="text-xs text-slate-500 mt-1">Configure business operating rules, delivery slots, tax rates, and serviceable areas</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Business Name</label>
          <input
            type="text"
            value={settings.businessName}
            onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
            className="input text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Operating City</label>
            <input
              type="text"
              value={settings.city}
              onChange={(e) => setSettings({ ...settings, city: e.target.value })}
              className="input text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Standard GST Tax (%)</label>
            <input
              type="number"
              value={settings.gstRate}
              onChange={(e) => setSettings({ ...settings, gstRate: e.target.value })}
              className="input text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Standard Delivery Fee (₹)</label>
            <input
              type="number"
              value={settings.deliveryFee}
              onChange={(e) => setSettings({ ...settings, deliveryFee: e.target.value })}
              className="input text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Serviceable Pincodes (Comma Separated)</label>
          <textarea
            rows={2}
            value={settings.pincodes}
            onChange={(e) => setSettings({ ...settings, pincodes: e.target.value })}
            className="input text-xs resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Configured Pickup Slots</label>
          <input
            type="text"
            value={settings.pickupSlots}
            onChange={(e) => setSettings({ ...settings, pickupSlots: e.target.value })}
            className="input text-xs"
          />
        </div>

        <div className="pt-2">
          <button type="submit" className="btn btn-primary btn-md gap-2">
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
