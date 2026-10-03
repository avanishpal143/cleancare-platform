import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import PortalSwitcher from '../components/PortalSwitcher';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'CleanCare Driver — Pick. Deliver. Make People Happy.',
  description: 'CleanCare Driver App for pickup and delivery partners.',
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-100/90 md:bg-gradient-to-br md:from-slate-100 md:via-blue-50/20 md:to-indigo-50/20 min-h-screen text-slate-900 font-sans antialiased flex flex-col items-center justify-center">
        {/* Sleek App Frame: Full width on mobile, beautifully framed on desktop */}
        <div className="w-full max-w-md min-h-screen md:min-h-[844px] md:max-h-[900px] md:my-6 md:rounded-[36px] bg-slate-50 flex flex-col shadow-xl md:shadow-2xl relative md:border md:border-slate-200/80 overflow-hidden">
          {children}
        </div>
        <PortalSwitcher currentApp="driver" />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
            },
          }}
        />
      </body>
    </html>
  );
}
