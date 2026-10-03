import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import PortalSwitcher from '../components/PortalSwitcher';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'CleanCare Admin',
  description: 'CleanCare Operations & Admin Portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <PortalSwitcher currentApp="admin" />
        <Toaster position="top-right" toastOptions={{ duration: 3500, style: { background: '#1e293b', color: '#f8fafc', borderRadius: '10px', fontSize: '13px' } }} />
      </body>
    </html>
  );
}
