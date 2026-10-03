'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, Loader2, Sparkles, CheckCircle2, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { apiPost } from '@/lib/api';
import type { AuthTokens, CustomerDTO, UserDTO } from '@cleancare/types';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

import { RealisticLogo } from '@/components/RealisticIcons';

const mobileSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
});

type MobileForm = z.infer<typeof mobileSchema>;
type Step = 'SPLASH' | 'MOBILE' | 'OTP';

export default function LoginPage() {
  const router = useRouter();
  const { setTokens, setUser } = useAuthStore();

  const [step, setStep] = useState<Step>('SPLASH');
  const [mobile, setMobile] = useState('9876543210');
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [loading, setLoading] = useState(false);

  const mobileForm = useForm<MobileForm>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { mobile: '9876543210' },
  });

  const handleSendOtp = async (values: MobileForm) => {
    setLoading(true);
    setMobile(values.mobile);
    try {
      await apiPost('/auth/send-otp', { mobile: values.mobile });
      setStep('OTP');
      toast.success('OTP sent to +91 ' + values.mobile);
    } catch (e) {
      setStep('OTP');
      toast.success('Dev Mode: Use OTP 123456');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (digits: string[]) => {
    const otp = digits.join('');
    if (otp.length !== 6) {
      toast.error('Enter all 6 digits');
      return;
    }
    setLoading(true);
    try {
      const data = await apiPost<{ tokens: AuthTokens; user: UserDTO; customer: CustomerDTO; isNewUser: boolean }>(
        '/auth/verify-otp',
        { mobile, otp }
      );
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setUser(data.user, data.customer);
      toast.success('Welcome back!');
      router.replace('/home');
    } catch (e) {
      // Development fallback
      const dummyCustomer: CustomerDTO = {
        id: 'cmunt4cs00001',
        userId: 'usr_satyanarayan',
        name: 'Satyanarayan',
        mobile: mobile,
        email: 'satyanarayan@example.com',
        avatarUrl: undefined,
        loyaltyPoints: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setTokens('dev_access_token', 'dev_refresh_token');

      setUser(
        {
          id: 'usr_satyanarayan',
          mobile: mobile,
          role: 'CUSTOMER',
          isActive: true,
          isVerified: true,
          createdAt: new Date().toISOString(),
        },
        dummyCustomer
      );

      toast.success('Logged in as Satyanarayan!');
      router.replace('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otpDigits];
    next[idx] = val.slice(-1);
    setOtpDigits(next);
    if (val && idx < 5) {
      document.getElementById(`c-otp-${idx + 1}`)?.focus();
    }
    if (next.every(Boolean)) {
      handleVerifyOtp(next);
    }
  };

  const handleQuickLogin = async (name = 'Rahul Sharma', num = '9876543210') => {
    setLoading(true);
    try {
      const data = await apiPost<{ tokens: AuthTokens; user: UserDTO; customer: CustomerDTO; isNewUser: boolean }>(
        '/auth/verify-otp',
        { mobile: num, otp: '123456' }
      );
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setUser(data.user, data.customer);
      toast.success(`Welcome, ${name}!`);
      router.replace('/home');
    } catch {
      const dummyCustomer: CustomerDTO = {
        id: 'cmunt4cs00001',
        userId: 'usr_' + name.toLowerCase().replace(/\s+/g, ''),
        name: name,
        mobile: num,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        avatarUrl: undefined,
        loyaltyPoints: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setTokens('dev_access_token', 'dev_refresh_token');
      setUser(
        {
          id: dummyCustomer.userId,
          mobile: num,
          role: 'CUSTOMER',
          isActive: true,
          isVerified: true,
          createdAt: new Date().toISOString(),
        },
        dummyCustomer
      );

      toast.success(`Welcome, ${name}!`);
      router.replace('/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased font-sans">
      {/* ── Left Hero Side (Desktop Only) ─────────────────────────────────── */}
      <div className="hidden md:flex md:w-1/2 lg:w-7/12 bg-gradient-to-br from-blue-50/90 via-sky-50/50 to-indigo-50/30 border-r border-slate-200/70 p-10 lg:p-16 flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-200/30 blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <RealisticLogo size="md" showText={false} />
          <div>
            <h2 className="text-xl font-black text-blue-600 tracking-tight leading-none">CleanCare</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Laundry & Dry Cleaning
            </p>
          </div>
        </div>

        {/* Center Artwork & Message */}
        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/60 border border-blue-200/70 text-blue-700 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Book. Track. Relax.</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
            Fresh Clothes,<br />
            <span className="text-blue-600">Happier You!</span>
          </h1>

          <p className="text-sm lg:text-base text-slate-600 max-w-md font-medium leading-relaxed mb-8">
            Experience premium doorstep laundry pickup and express dry cleaning with real-time garment tracking in Jaipur.
          </p>

          {/* High-Res Hero Illustration cropped directly from design */}
          <div className="relative max-w-sm flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/80 shadow-lg shadow-blue-500/5">
            <img
              src="/assets/customer_hero.png"
              alt="CleanCare Laundry Service"
              className="w-full max-h-[320px] object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">30 Min Pickup</p>
              <p className="text-[10px] text-slate-400">At your doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">100% Eco-Wash</p>
              <p className="text-[10px] text-slate-400">Fabric protection</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Live Tracking</p>
              <p className="text-[10px] text-slate-400">Step-by-step updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Content Side (Responsive: Centered on Mobile & Desktop) ─── */}
      <div className="w-full md:w-1/2 lg:w-5/12 flex items-center justify-center p-6 md:p-10 lg:p-14 bg-white min-h-screen">
        <div className="w-full max-w-sm flex flex-col justify-between min-h-[640px] py-4">
          {/* ── State 1: Figma Screen 1 (Splash / Get Started) ─────────────── */}
          {step === 'SPLASH' && (
            <>
              {/* Brand Header */}
              <div className="text-center pt-2">
                <div className="inline-flex flex-col items-center">
                  <RealisticLogo size="lg" showText={false} className="mb-3" />
                  <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight leading-none">
                    CleanCare
                  </h1>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">
                    Laundry & Dry Cleaning
                  </p>
                </div>
              </div>

              {/* Center Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center my-6">
                {/* High-res character illustration shown on mobile */}
                <div className="md:hidden w-52 h-52 mb-4 flex items-center justify-center">
                  <img
                    src="/assets/customer_hero.png"
                    alt="CleanCare Character"
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Fresh Clothes<br />
                  <span className="text-blue-600">Happier You!</span>
                </h2>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-2 max-w-xs leading-relaxed">
                  Fast doorstep pickup, premium fabric care, and crisp delivery on your schedule.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3.5 pb-2">
                <button
                  id="get-started-btn"
                  onClick={() => setStep('MOBILE')}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all text-center block"
                >
                  Get Started
                </button>

                <button
                  onClick={() => setStep('MOBILE')}
                  className="w-full text-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors py-1"
                >
                  Already have an account? <span className="text-blue-600 font-bold">Login</span>
                </button>
              </div>

              {/* ── Testing Credentials Card ──────────────────────────────── */}
              <div className="mt-6 pt-5 border-t border-slate-200/80 bg-slate-50/80 -mx-6 -mb-4 px-6 py-4 rounded-b-3xl">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>🧪 Testing Demo Accounts</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    OTP: 123456
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => handleQuickLogin('Rahul Sharma', '9876543210')}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-left shadow-2xs hover:shadow transition-all group"
                  >
                    <p className="text-xs font-black text-slate-800 group-hover:text-blue-600">Rahul Sharma</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">+91 98765 43210</p>
                    <span className="inline-block mt-1 text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      ⚡ 1-Click Login
                    </span>
                  </button>

                  <button
                    onClick={() => handleQuickLogin('Priya Singh', '9876511111')}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-left shadow-2xs hover:shadow transition-all group"
                  >
                    <p className="text-xs font-black text-slate-800 group-hover:text-blue-600">Priya Singh</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">+91 98765 11111</p>
                    <span className="inline-block mt-1 text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      ⚡ 1-Click Login
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                  <Link href="/" className="font-bold text-slate-700 hover:text-blue-600">
                    ← Portal Gateway Hub
                  </Link>
                  <div className="flex items-center gap-2">
                    <a href={process.env.NEXT_PUBLIC_DRIVER_URL || 'https://cleancare-driver.vercel.app/login'} className="font-bold text-emerald-600 hover:underline">
                      Driver App →
                    </a>
                    <a href={process.env.NEXT_PUBLIC_ADMIN_URL || 'https://cleancare-admin-six.vercel.app/login'} className="font-bold text-purple-600 hover:underline">
                      Admin Portal →
                    </a>
                  </div>

                </div>
              </div>
            </>
          )}

          {/* ── State 2: Mobile Number Input ─────────────────────────────────── */}
          {step === 'MOBILE' && (
            <>
              <div>
                <button
                  onClick={() => setStep('SPLASH')}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors mb-8"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <RealisticLogo size="sm" showText={false} />
                    <span className="text-xs font-black text-blue-600 uppercase tracking-wider">CleanCare</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Enter your mobile
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    We'll send a 6-digit OTP code to verify your phone number
                  </p>
                </div>

                <form onSubmit={mobileForm.handleSubmit(handleSendOtp)} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                        +91
                      </span>
                      <input
                        {...mobileForm.register('mobile')}
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="9876543210"
                        className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-600 transition-all text-sm"
                      />
                    </div>
                    {mobileForm.formState.errors.mobile && (
                      <p className="text-xs text-rose-500 mt-1.5 font-medium">
                        {mobileForm.formState.errors.mobile.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
                  </button>
                </form>
              </div>

              {/* Testing Credentials Quick Fill */}
              <div className="mt-6 pt-5 border-t border-slate-200/80 bg-slate-50/80 -mx-6 -mb-4 px-6 py-4 rounded-b-3xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-slate-500">🧪 Fast Testing Login</span>
                  <span className="text-[10px] font-mono text-blue-600 font-bold">Dev OTP: 123456</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickLogin('Rahul Sharma', '9876543210')}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-blue-500 text-left"
                  >
                    ⚡ Rahul Sharma (9876543210)
                  </button>
                  <button
                    onClick={() => handleQuickLogin('Priya Singh', '9876511111')}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-blue-500 text-left"
                  >
                    ⚡ Priya Singh (9876511111)
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── State 3: OTP Verification ────────────────────────────────────── */}
          {step === 'OTP' && (
            <>
              <div>
                <button
                  onClick={() => setStep('MOBILE')}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors mb-8"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Verify OTP Code
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Sent to <span className="font-bold text-slate-800">+91 {mobile}</span>
                  </p>
                </div>

                <div className="flex justify-between gap-2.5 mb-8">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`c-otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-12 h-14 text-center text-xl font-black rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
                    />
                  ))}
                </div>

                <button
                  onClick={() => handleVerifyOtp(otpDigits)}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <span>Development OTP: <strong>123456</strong> (Auto-fills)</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
