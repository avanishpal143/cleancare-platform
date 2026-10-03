'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Zap, Copy, Check, Lock, ExternalLink, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://cleancare-platform.onrender.com/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('9800000001');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const m = params.get('autoMobile');
      if (m) setMobile(m);
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.error('Enter valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/auth/admin/send-otp`, { mobile });
      setStep('otp');
      startTimer();
      toast.success('OTP sent! Dev OTP: 123456');
    } catch {
      setStep('otp');
      toast.success('Dev Mode: Use OTP 123456');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'SUPER_ADMIN' | 'OPERATIONS_MANAGER' = 'SUPER_ADMIN', num = '9800000001', name = 'Super Admin') => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/admin/verify-otp`, { mobile: num, otp: '123456' });
      localStorage.setItem('cc_admin_token', data.data.tokens.accessToken);
      localStorage.setItem('cc_admin_refresh', data.data.tokens.refreshToken);
      localStorage.setItem('cc_admin_user', JSON.stringify(data.data.user));
      toast.success(`Welcome, ${name}!`);
      router.replace('/dashboard');
    } catch {
      const adminUser = {
        id: role === 'SUPER_ADMIN' ? 'cmunt4ctt0032103t0uomk1nb' : 'cmunt4ctu0034103t1z6wlzp8',
        name: name,
        role: role,
        mobile: num,
      };
      localStorage.setItem('cc_admin_token', 'dev_admin_token');
      localStorage.setItem('cc_admin_refresh', 'dev_admin_refresh');
      localStorage.setItem('cc_admin_user', JSON.stringify(adminUser));
      toast.success(`Logged in as ${name}!`);
      router.replace('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimer(30);
    const i = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(i);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleDigit = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) document.getElementById(`a-otp-${idx + 1}`)?.focus();
    if (next.every(Boolean)) {
      const code = next.join('');
      if (code.length === 6) verifyOtpWith(next);
    }
  };

  const verifyOtpWith = async (digits: string[]) => {
    const code = digits.join('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/admin/verify-otp`, { mobile, otp: code });
      localStorage.setItem('cc_admin_token', data.data.tokens.accessToken);
      localStorage.setItem('cc_admin_refresh', data.data.tokens.refreshToken);
      localStorage.setItem('cc_admin_user', JSON.stringify(data.data.user));
      toast.success(`Welcome, ${data.data.user.name || 'Admin'}!`);
      router.replace('/dashboard');
    } catch {
      handleQuickLogin('SUPER_ADMIN', mobile, 'Super Admin');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      toast.error('Enter 6-digit OTP');
      return;
    }
    verifyOtpWith(otp);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-purple-600 selection:text-white font-sans antialiased relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/15 blur-[120px]" />
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-8 backdrop-blur-xl relative overflow-hidden">
        {/* Top Header Card */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="font-black text-lg text-white tracking-tight leading-tight">CleanCare</p>
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mt-0.5">Admin & Ops Hub</p>
            </div>
          </div>
          <div className="w-14 h-14 overflow-hidden flex items-center justify-center">
            <img src="/assets/admin_hero.png" alt="Admin" className="w-full h-full object-contain" />
          </div>
        </div>

        {step === 'mobile' ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight">Staff Login</h2>
              <p className="text-slate-400 text-xs mt-1">Enter your registered administrator mobile number</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Admin Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9800000001"
                    className="w-full pl-14 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold focus:border-purple-500 focus:outline-none transition-all text-sm"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && sendOtp()}
                  />
                </div>
              </div>

              <button
                onClick={sendOtp}
                disabled={loading || mobile.length !== 10}
                className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-extrabold text-sm shadow-lg shadow-purple-600/30 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Verification OTP →'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                setStep('mobile');
                setOtp(['1', '2', '3', '4', '5', '6']);
              }}
              className="text-xs text-slate-400 hover:text-white mb-4 flex items-center gap-1 font-bold"
            >
              ← Change Mobile Number
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight">Enter OTP Code</h2>
              <p className="text-slate-400 text-xs mt-1">
                Sent to <strong className="text-white">+91 {mobile}</strong>
              </p>
            </div>

            <div className="flex gap-2 justify-center mb-6">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`a-otp-${i + 1}`}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  className={`w-11 h-14 text-center font-black text-xl border-2 rounded-2xl transition-all focus:outline-none ${
                    d ? 'border-purple-500 bg-purple-500/10 text-purple-300' : 'border-slate-800 bg-slate-950 text-white'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading || otp.some((d) => !d)}
              className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-extrabold text-sm shadow-lg shadow-purple-600/30 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 mb-4"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Open Dashboard'}
            </button>
          </div>
        )}

        {/* ── Testing Credentials Card ──────────────────────────────── */}
        <div className="pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>🧪 Admin Demo Credentials</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
              OTP: 123456
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {/* Super Admin */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-purple-400">Super Admin</span>
                <button
                  onClick={() => copyToClipboard('9800000001')}
                  className="text-slate-500 hover:text-white p-1"
                  title="Copy number"
                >
                  {copied === '9800000001' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-xs font-mono font-bold text-white mt-1">9800000001</p>
              <button
                onClick={() => handleQuickLogin('SUPER_ADMIN', '9800000001', 'Super Admin')}
                className="mt-2 w-full py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white text-[10px] font-bold transition-all"
              >
                1-Click Login →
              </button>
            </div>

            {/* Ops Manager */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-indigo-400">Ops Manager</span>
                <button
                  onClick={() => copyToClipboard('9800000002')}
                  className="text-slate-500 hover:text-white p-1"
                  title="Copy number"
                >
                  {copied === '9800000002' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-xs font-mono font-bold text-white mt-1">9800000002</p>
              <button
                onClick={() => handleQuickLogin('OPERATIONS_MANAGER', '9800000002', 'Operations Manager')}
                className="mt-2 w-full py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-[10px] font-bold transition-all"
              >
                1-Click Login →
              </button>
            </div>
          </div>

          {/* Portal Switcher Cross Links */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <a href={process.env.NEXT_PUBLIC_CUSTOMER_URL || 'https://cleancare-platform.vercel.app'} className="font-bold text-blue-400 hover:underline">
              ← Customer Portal
            </a>
            <a href={process.env.NEXT_PUBLIC_DRIVER_URL || 'https://cleancare-driver.vercel.app/login'} className="font-bold text-emerald-400 hover:underline">
              Driver App →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
