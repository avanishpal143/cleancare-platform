'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Loader2, ArrowRight, ShieldCheck, Zap, Copy, Check, MapPin, Package } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://cleancare-platform.onrender.com/api';

export default function DriverLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('9876500010');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const m = params.get('autoMobile');
      if (m) setMobile(m);
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.error('Enter valid 10-digit number');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/auth/driver/send-otp`, { mobile });
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

  const handleQuickLogin = async (name = 'Rakesh Meena', num = '9876500010') => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/driver/verify-otp`, { mobile: num, otp: '123456' });
      localStorage.setItem('cc_driver_token', data.data.tokens.accessToken);
      localStorage.setItem('cc_driver_refresh', data.data.tokens.refreshToken);
      localStorage.setItem('cc_driver_user', JSON.stringify(data.data.driver));
      toast.success(`Welcome, ${name}!`);
      router.replace('/dashboard');
    } catch {
      const defaultDriver = {
        id: 'cmunt4cuz0044103t0rl51erq',
        userId: 'cmunt4cuy0042103trvm4v0yg',
        name: name,
        mobile: num,
        vehicleType: 'Bike',
        vehicleNumber: 'RJ14-AB-1234',
      };
      localStorage.setItem('cc_driver_token', 'dev_driver_token');
      localStorage.setItem('cc_driver_refresh', 'dev_driver_refresh');
      localStorage.setItem('cc_driver_user', JSON.stringify(defaultDriver));
      toast.success(`Welcome, ${name}!`);
      router.replace('/dashboard');
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
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/driver/verify-otp`, { mobile, otp: code });
      localStorage.setItem('cc_driver_token', data.data.tokens.accessToken);
      localStorage.setItem('cc_driver_refresh', data.data.tokens.refreshToken);
      localStorage.setItem('cc_driver_user', JSON.stringify(data.data.driver));
      toast.success(`Welcome, ${data.data.driver.name}!`);
      router.replace('/dashboard');
    } catch {
      handleQuickLogin('Rakesh Meena', mobile);
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
    if (val && idx < 5) document.getElementById(`otp-d-${idx + 1}`)?.focus();
    if (next.every(Boolean)) {
      setTimeout(() => verifyOtpWith(next), 100);
    }
  };

  const verifyOtpWith = async (digits: string[]) => {
    const code = digits.join('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/driver/verify-otp`, { mobile, otp: code });
      localStorage.setItem('cc_driver_token', data.data.tokens.accessToken);
      localStorage.setItem('cc_driver_refresh', data.data.tokens.refreshToken);
      localStorage.setItem('cc_driver_user', JSON.stringify(data.data.driver));
      toast.success(`Welcome, ${data.data.driver.name}!`);
      router.replace('/dashboard');
    } catch {
      handleQuickLogin('Rakesh Meena', mobile);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-white min-h-screen p-6 antialiased selection:bg-emerald-600 selection:text-white">
      {/* Top Header Card */}
      <div className="pt-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-emerald-500/20 border border-emerald-200 bg-white p-1">
              <img src="/images/logo.png" alt="CleanCare" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 block leading-tight">
                CleanCare
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                Driver Partner App
              </span>
            </div>
          </div>
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/assets/driver_hero.png" alt="Driver" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Driver Partner Login
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pick. Deliver. Make People Happy. Fast doorstep logistics.
          </p>
        </div>

        {step === 'mobile' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Registered Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876500010"
                  className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-emerald-600 transition-all text-sm"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && sendOtp()}
                />
              </div>
            </div>

            <button
              onClick={sendOtp}
              disabled={loading || mobile.length !== 10}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <button
                onClick={() => setStep('mobile')}
                className="text-xs text-slate-500 hover:text-slate-800 mb-2 flex items-center gap-1 font-bold"
              >
                ← Change Number
              </button>
              <p className="text-xs text-slate-500">
                Enter 6-digit OTP code sent to <strong className="text-slate-900">+91 {mobile}</strong>
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-d-${i}`}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  className={`w-11 h-14 text-center font-black text-xl border-2 rounded-2xl transition-all focus:outline-none ${
                    d ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-900'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading || otp.some((d) => !d)}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
            </button>
          </div>
        )}
      </div>

      {/* ── Testing Credentials Card ──────────────────────────────── */}
      <div className="mt-8 pt-5 border-t border-slate-200 bg-slate-50 -mx-6 -mb-6 px-6 py-5 rounded-b-[36px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>🧪 Driver Demo Credentials</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            OTP: 123456
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 transition-colors shadow-2xs mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-900">Rakesh Meena (Active Driver)</p>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">+91 98765 00010</p>
            </div>
            <button
              onClick={() => copyToClipboard('9876500010')}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              title="Copy number"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={() => handleQuickLogin('Rakesh Meena', '9876500010')}
            className="w-full mt-2.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>⚡ 1-Click Login (Rakesh Meena)</span>
          </button>
        </div>

        {/* Portal Cross-Links */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/80">
          <a href={process.env.NEXT_PUBLIC_CUSTOMER_URL || 'https://cleancare-platform.vercel.app'} className="font-bold text-blue-600 hover:underline">
            ← Customer Portal
          </a>
          <a href={process.env.NEXT_PUBLIC_ADMIN_URL || 'https://cleancare-admin-six.vercel.app/login'} className="font-bold text-purple-600 hover:underline">
            Admin Portal →
          </a>
        </div>

      </div>
    </div>
  );
}
