'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
function authH() { const t = localStorage.getItem('cc_admin_token'); return t ? { Authorization: `Bearer ${t}` } : {}; }

const UNIT_LABELS: Record<string, string> = {
  PER_ITEM:'per item', PER_KG:'per kg', PER_PAIR:'per pair', PER_PANEL:'per panel', PER_SET:'per set',
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState<'ALL'|'ACTIVE'|'INACTIVE'>('ALL');
  const [modal,    setModal]    = useState<{ open: boolean; service?: any }>({ open: false });
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState<any>({});

  const load = async () => {
    setLoading(true);
    try { const { data } = await axios.get(`${API}/services`, { headers: authH() }); setServices(data.data ?? []); }
    catch { toast.error('Failed to load services'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const displayed = services.filter((s) =>
    filter === 'ALL' ? true : filter === 'ACTIVE' ? s.isActive : !s.isActive
  );

  const openCreate = () => { setForm({ name:'', description:'', unit:'PER_ITEM', basePrice:'', turnaroundDays:2, isActive:true }); setModal({ open: true }); };
  const openEdit   = (s: any) => { setForm({ ...s }); setModal({ open: true, service: s }); };

  const handleSave = async () => {
    if (!form.name || !form.basePrice) { toast.error('Name and price required'); return; }
    setSaving(true);
    try {
      if (modal.service) {
        await axios.put(`${API}/services/${modal.service.id}`, form, { headers: authH() });
        toast.success('Service updated');
      } else {
        await axios.post(`${API}/services`, form, { headers: authH() });
        toast.success('Service created');
      }
      setModal({ open: false });
      load();
    } catch (e: any) { toast.error(e.response?.data?.error ?? 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleToggle = async (s: any) => {
    try {
      await axios.put(`${API}/services/${s.id}/toggle-active`, { isActive: !s.isActive }, { headers: authH() });
      toast.success(s.isActive ? 'Service deactivated' : 'Service activated');
      load();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="page-title">Services</h1><p className="page-desc">Manage your service catalogue</p></div>
        <button onClick={openCreate} className="btn btn-primary btn-md gap-1.5"><Plus className="w-4 h-4" />Add Service</button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4">
        {(['ALL','ACTIVE','INACTIVE'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={clsx('px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all',
              filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200')}>
            {f} ({f === 'ALL' ? services.length : f === 'ACTIVE' ? services.filter((s) => s.isActive).length : services.filter((s) => !s.isActive).length})
          </button>
        ))}
      </div>

      {/* Helper note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 mb-4 text-xs text-blue-700">
        💡 Marking a service <strong>Inactive</strong> hides it from the customer app immediately, without losing pricing history.
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="table">
          <thead><tr>{['Service','Description','Price','Unit','Turnaround','Status','Actions'].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_,i) => <tr key={i} className="tr">{[...Array(7)].map((_,j) => <td key={j} className="td"><div className="h-3.5 bg-slate-100 rounded animate-pulse w-20" /></td>)}</tr>)
            ) : displayed.length === 0 ? (
              <tr><td colSpan={7} className="td text-center py-10 text-slate-400">No services found</td></tr>
            ) : (
              displayed.map((s) => (
                <tr key={s.id} className="tr">
                  <td className="td font-semibold text-slate-900">{s.name}</td>
                  <td className="td text-xs text-slate-500 max-w-xs truncate">{s.description || '—'}</td>
                  <td className="td font-semibold text-slate-800">₹{s.basePrice}</td>
                  <td className="td text-xs text-slate-500">{UNIT_LABELS[s.unit] ?? s.unit}</td>
                  <td className="td text-xs text-slate-500">{s.turnaroundDays}–{s.turnaroundDays + 1} days</td>
                  <td className="td">
                    <span className={clsx('chip', s.isActive ? 'chip-green' : 'chip-gray')}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="td">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(s)} className="btn btn-ghost btn-xs"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleToggle(s)} className="btn btn-ghost btn-xs" title={s.isActive ? 'Deactivate' : 'Activate'}>
                        {s.isActive ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">{modal.service ? 'Edit Service' : 'New Service'}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="label">Name *</label><input value={form.name ?? ''} onChange={(e) => setForm({...form, name: e.target.value})} className="input" placeholder="Dry Cleaning" /></div>
              <div><label className="label">Description</label><textarea value={form.description ?? ''} onChange={(e) => setForm({...form, description: e.target.value})} className="input resize-none" rows={2} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Base Price (₹) *</label><input type="number" value={form.basePrice ?? ''} onChange={(e) => setForm({...form, basePrice: Number(e.target.value)})} className="input" /></div>
                <div><label className="label">Unit</label>
                  <select value={form.unit ?? 'PER_ITEM'} onChange={(e) => setForm({...form, unit: e.target.value})} className="input">
                    {Object.entries(UNIT_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="label">Turnaround (days)</label><input type="number" value={form.turnaroundDays ?? 2} onChange={(e) => setForm({...form, turnaroundDays: Number(e.target.value)})} className="input" /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.isActive ?? true} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="rounded" />
                <label htmlFor="active" className="text-sm text-slate-700">Active (visible to customers)</label>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setModal({ open: false })} className="flex-1 btn btn-outline btn-md">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 btn btn-primary btn-md">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : modal.service ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
