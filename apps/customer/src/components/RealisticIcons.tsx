'use client';

import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

// ============================================================================
// 1. REALISTIC 3D CLEANCARE LOGO BADGE
// ============================================================================
export function RealisticLogo({
  size = 'md',
  showText = false,
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}) {
  const sizeMap = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-11 h-11 rounded-2xl',
    lg: 'w-16 h-16 rounded-3xl',
    xl: 'w-24 h-24 rounded-[32px]',
  };

  return (
    <div className={clsx('flex items-center gap-3 group select-none', className)}>
      <div
        className={clsx(
          'relative overflow-hidden bg-white shadow-lg shadow-blue-500/20 border border-sky-200/90 ring-2 ring-white/95 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/35 flex-shrink-0',
          sizeMap[size]
        )}
      >
        <img
          src="/images/logo.png"
          alt="CleanCare 3D Logo"
          className="w-full h-full object-cover"
        />
        {/* Specular sheen sweep animation */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/45 to-transparent pointer-events-none animate-sheen" />
        {/* Subtle inner ambient ring */}
        <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-sky-300/40 pointer-events-none" />
      </div>

      {showText && (
        <div className="leading-tight">
          <span className="text-xl font-black bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight block">
            CleanCare
          </span>
          <span className="text-[9px] font-extrabold text-sky-600/90 uppercase tracking-[0.22em] block mt-0.5">
            Laundry & Dry Clean
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. REALISTIC 3D SERVICE ICONS (Steam Press & Special Care)
// ============================================================================

/** Realistic 3D Garment Steam Press with hot mist and chrome reflection */
export function RealisticSteamPressIcon({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <div className={clsx('relative flex items-center justify-center group', className)}>
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-400/30 to-amber-400/30 blur-md pointer-events-none group-hover:scale-110 transition-transform duration-300" />
      
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 drop-shadow-md">
        <defs>
          <linearGradient id="pressBodyGrad" x1="12" y1="20" x2="52" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FB7185" />
            <stop offset="0.5" stopColor="#E11D48" />
            <stop offset="1" stopColor="#9F1239" />
          </linearGradient>
          <linearGradient id="pressHandleGrad" x1="20" y1="10" x2="48" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.6" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="chromePlateGrad" x1="10" y1="46" x2="54" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.3" stopColor="#CBD5E1" />
            <stop offset="0.7" stopColor="#F8FAFC" />
            <stop offset="1" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id="steamMistGrad" x1="32" y1="48" x2="32" y2="62" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="1" stopColor="#E0F2FE" stopOpacity="0" />
          </linearGradient>
          <filter id="ironShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#881337" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 3D Steam Cloud Puffs */}
        <g opacity="0.85" className="animate-bubble">
          <ellipse cx="22" cy="54" rx="4.5" ry="3.5" fill="#E0F2FE" />
          <ellipse cx="32" cy="56" rx="6" ry="4" fill="#BAE6FD" />
          <ellipse cx="44" cy="53" rx="5" ry="3.5" fill="#E0F2FE" />
          <circle cx="16" cy="58" r="2.5" fill="#7DD3FC" />
          <circle cx="50" cy="57" r="3" fill="#7DD3FC" />
        </g>

        {/* Soleplate Base */}
        <path
          d="M12 48C12 48 18 52 32 52C46 52 52 48 52 48L50 44H14L12 48Z"
          fill="url(#chromePlateGrad)"
        />

        {/* 3D Iron Body */}
        <path
          d="M14 44C14 44 18 28 32 26C44 24 50 44 50 44H14Z"
          fill="url(#pressBodyGrad)"
          filter="url(#ironShadow)"
        />
        {/* Specular curved body reflection highlight */}
        <path
          d="M20 38C22 32 30 29 40 30"
          stroke="#FDA4AF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* 3D Ergonomic Top Handle */}
        <path
          d="M22 28V16C22 13 25 11 29 11H39C43 11 46 13 46 16V29"
          stroke="url(#pressHandleGrad)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Grip highlight */}
        <path
          d="M28 12.5H37"
          stroke="#FEF08A"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Water Tank View Window (Cyan Jewel Glow) */}
        <rect x="27" y="32" width="10" height="6" rx="3" fill="#38BDF8" opacity="0.9" />
        <circle cx="30" cy="34" r="1" fill="#FFFFFF" />

        {/* Sparkles */}
        <path d="M48 12L49.5 15L52.5 16.5L49.5 18L48 21L46.5 18L43.5 16.5L46.5 15L48 12Z" fill="#FDE047" />
        <path d="M14 20L15 22L17 23L15 24L14 26L13 24L11 23L13 22L14 20Z" fill="#FDE047" opacity="0.9" />
      </svg>
    </div>
  );
}

/** Realistic 3D Luxury Special Care (Faceted Crystal Jewel, Silk Ribbon & Golden Sparkles) */
export function RealisticSpecialCareIcon({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <div className={clsx('relative flex items-center justify-center group', className)}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 blur-md pointer-events-none group-hover:scale-110 transition-transform duration-300" />
      
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 drop-shadow-md">
        <defs>
          <linearGradient id="gemTop" x1="16" y1="16" x2="48" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5D0FE" />
            <stop offset="0.5" stopColor="#D946EF" />
            <stop offset="1" stopColor="#A21CAF" />
          </linearGradient>
          <linearGradient id="gemSideLeft" x1="12" y1="28" x2="32" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C084FC" />
            <stop offset="1" stopColor="#7E22CE" />
          </linearGradient>
          <linearGradient id="gemSideRight" x1="52" y1="28" x2="32" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E879F9" />
            <stop offset="1" stopColor="#9333EA" />
          </linearGradient>
          <linearGradient id="gemCenter" x1="32" y1="28" x2="32" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FAF5FF" />
            <stop offset="0.4" stopColor="#E9D5FF" />
            <stop offset="1" stopColor="#6B21A8" />
          </linearGradient>
          <linearGradient id="goldRibbon" x1="14" y1="36" x2="50" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.6" stopColor="#EAB308" />
            <stop offset="1" stopColor="#CA8A04" />
          </linearGradient>
        </defs>

        {/* Ambient Silk Ribbon Swirl */}
        <path
          d="M12 40C20 48 44 48 52 40C44 54 20 54 12 40Z"
          fill="url(#goldRibbon)"
          opacity="0.85"
        />

        {/* 3D Faceted Diamond / Crown Gem */}
        {/* Crown Table top */}
        <polygon points="22,18 42,18 50,28 14,28" fill="url(#gemTop)" />

        {/* Facet Center */}
        <polygon points="22,28 42,28 32,52" fill="url(#gemCenter)" />

        {/* Facet Left */}
        <polygon points="14,28 22,28 32,52" fill="url(#gemSideLeft)" />

        {/* Facet Right */}
        <polygon points="42,28 50,28 32,52" fill="url(#gemSideRight)" />

        {/* Specular Highlights */}
        <polygon points="23,19 41,19 37,23 27,23" fill="#FFFFFF" opacity="0.75" />
        <line x1="32" y1="28" x2="32" y2="48" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

        {/* Radiance Sparkles */}
        <g className="animate-pulse-glow">
          <path d="M50 14L52 19L57 21L52 23L50 28L48 23L43 21L48 19L50 14Z" fill="#FDE047" />
          <path d="M14 16L15.5 19.5L19 21L15.5 22.5L14 26L12.5 22.5L9 21L12.5 19.5L14 16Z" fill="#FDE047" />
          <circle cx="32" cy="12" r="2.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 3. REALISTIC 3D GARMENT ICONS (Folded Shirts, Jeans, Suits, Sarees, Jackets)
// ============================================================================

/** Realistic 3D Folded Formal Shirt / Kurta with Collar Stiffener and Buttons */
export function RealisticShirtIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx('drop-shadow-sm', className)}>
      <defs>
        <linearGradient id="shirtBody" x1="12" y1="8" x2="36" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="0.5" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="shirtCollar" x1="18" y1="6" x2="30" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EFF6FF" />
          <stop offset="1" stopColor="#DBEAFE" />
        </linearGradient>
      </defs>
      {/* Shirt Torso */}
      <path
        d="M12 14L8 18V42C8 43.1 8.9 44 10 44H38C39.1 44 40 43.1 40 42V18L36 14L30 18H18L12 14Z"
        fill="url(#shirtBody)"
      />
      {/* Front Placket */}
      <rect x="22" y="16" width="4" height="28" fill="#2563EB" />
      {/* Mother-of-pearl buttons */}
      <circle cx="24" cy="22" r="1.5" fill="#FFFFFF" />
      <circle cx="24" cy="29" r="1.5" fill="#FFFFFF" />
      <circle cx="24" cy="36" r="1.5" fill="#FFFFFF" />
      {/* 3D Folded Collar Wings */}
      <path d="M18 10L24 20L19 22L14 11C15.2 10.3 16.6 10 18 10Z" fill="url(#shirtCollar)" stroke="#BFDBFE" strokeWidth="0.8" />
      <path d="M30 10L24 20L29 22L34 11C32.8 10.3 31.4 10 30 10Z" fill="url(#shirtCollar)" stroke="#BFDBFE" strokeWidth="0.8" />
      {/* Pocket on chest */}
      <rect x="13" y="24" width="7" height="8" rx="1.5" fill="#2563EB" stroke="#60A5FA" strokeWidth="0.7" />
    </svg>
  );
}

/** Realistic 3D Denim Jeans / Trouser with golden stitch & rivets */
export function RealisticPantsIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx('drop-shadow-sm', className)}>
      <defs>
        <linearGradient id="jeansDenim" x1="12" y1="8" x2="36" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4338CA" />
          <stop offset="0.5" stopColor="#3730A3" />
          <stop offset="1" stopColor="#1E1B4B" />
        </linearGradient>
        <linearGradient id="waistband" x1="10" y1="8" x2="38" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
      </defs>
      {/* Waistband */}
      <rect x="10" y="8" width="28" height="6" rx="2" fill="url(#waistband)" />
      {/* Button & rivets */}
      <circle cx="24" cy="11" r="1.6" fill="#FBBF24" />
      <circle cx="12" cy="11" r="1" fill="#D97706" />
      <circle cx="36" cy="11" r="1" fill="#D97706" />
      {/* Legs */}
      <path
        d="M10 14H38L35 44H26L24 24L22 44H13L10 14Z"
        fill="url(#jeansDenim)"
      />
      {/* Golden contrast seams */}
      <path d="M24 14V24" stroke="#F59E0B" strokeWidth="1" strokeDasharray="1.5 1.5" />
      <path d="M14 18C17 18 19 21 19 23" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
      <path d="M34 18C31 18 29 21 29 23" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** Realistic 3D Tailored 2-Piece Suit / Blazer with Satin Lapel & Pocket Square */
export function RealisticSuitIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx('drop-shadow-sm', className)}>
      <defs>
        <linearGradient id="suitCharcoal" x1="8" y1="8" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#334155" />
          <stop offset="0.6" stopColor="#1E293B" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="lapelSatin" x1="16" y1="12" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#475569" />
          <stop offset="1" stopColor="#1E293B" />
        </linearGradient>
      </defs>
      {/* Inner White Shirt & Tie */}
      <polygon points="18,10 30,10 24,24" fill="#FFFFFF" />
      <polygon points="22.5,14 25.5,14 25,23 24,25 23,23" fill="#DC2626" />

      {/* Main Blazer Body */}
      <path
        d="M12 12L6 20V42C6 43.1 6.9 44 8 44H40C41.1 44 42 43.1 42 42V20L36 12L24 10L12 12Z"
        fill="url(#suitCharcoal)"
      />
      {/* Satin Lapels */}
      <path d="M12 12L21 28H15L10 18L12 12Z" fill="url(#lapelSatin)" />
      <path d="M36 12L27 28H33L38 18L36 12Z" fill="url(#lapelSatin)" />
      {/* Silk Pocket Square (Red / Gold) */}
      <path d="M30 22L33 19L36 22H30Z" fill="#EF4444" />
      {/* Golden buttons */}
      <circle cx="24" cy="33" r="1.5" fill="#F59E0B" />
      <circle cx="24" cy="39" r="1.5" fill="#F59E0B" />
    </svg>
  );
}

/** Realistic 3D Designer Silk Saree / Lehenga with Gold Zari Border */
export function RealisticSareeIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx('drop-shadow-sm', className)}>
      <defs>
        <linearGradient id="silkCrimson" x1="10" y1="8" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F43F5E" />
          <stop offset="0.5" stopColor="#E11D48" />
          <stop offset="1" stopColor="#9F1239" />
        </linearGradient>
        <linearGradient id="goldZari" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
      {/* Saree Pleats Body */}
      <path
        d="M14 10C18 8 30 8 34 10L42 40C38 43 28 44 24 44C20 44 10 43 6 40L14 10Z"
        fill="url(#silkCrimson)"
      />
      {/* Gold Zari Border Bottom */}
      <path d="M6 38C12 41 20 42 24 42C28 42 36 41 42 38L42 41C36 44 28 45 24 45C20 45 12 44 6 41V38Z" fill="url(#goldZari)" />
      {/* Pallu Drape Across */}
      <path
        d="M10 16C16 18 32 14 38 24C32 26 22 28 14 26"
        stroke="url(#goldZari)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Golden motifs / sequins */}
      <circle cx="20" cy="32" r="1.4" fill="#FDE047" />
      <circle cx="28" cy="34" r="1.4" fill="#FDE047" />
      <circle cx="24" cy="28" r="1.4" fill="#FDE047" />
    </svg>
  );
}

/** Realistic 3D Winter Jacket / Puffer Coat */
export function RealisticJacketIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx('drop-shadow-sm', className)}>
      <defs>
        <linearGradient id="jacketAmber" x1="10" y1="8" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="0.6" stopColor="#D97706" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
      {/* Faux fur collar hood */}
      <path d="M16 8C16 6 32 6 32 8C36 10 38 14 38 16H10C10 14 12 10 16 8Z" fill="#FDE68A" />
      {/* Puffer Quilted Body */}
      <path
        d="M10 16L4 22L7 40C7 41.1 7.9 42 9 42H39C40.1 42 41 41.1 41 40L44 22L38 16H10Z"
        fill="url(#jacketAmber)"
      />
      {/* Horizontal quilt stitches */}
      <line x1="8" y1="24" x2="40" y2="24" stroke="#92400E" strokeWidth="1.2" opacity="0.6" />
      <line x1="8" y1="30" x2="40" y2="30" stroke="#92400E" strokeWidth="1.2" opacity="0.6" />
      <line x1="8" y1="36" x2="40" y2="36" stroke="#92400E" strokeWidth="1.2" opacity="0.6" />
      {/* Center heavy duty silver zipper */}
      <line x1="24" y1="16" x2="24" y2="42" stroke="#F1F5F9" strokeWidth="2.4" strokeDasharray="2 1" />
      {/* Zipper pull */}
      <rect x="22.5" y="22" width="3" height="4" rx="1" fill="#E2E8F0" />
    </svg>
  );
}

/** Realistic 3D Soft Bed Sheet / Blanket / Quilt with Cloud-Soft Cushion */
export function RealisticBeddingIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx('drop-shadow-sm', className)}>
      <defs>
        <linearGradient id="quiltTeal" x1="8" y1="12" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2DD4BF" />
          <stop offset="0.5" stopColor="#0D9488" />
          <stop offset="1" stopColor="#115E59" />
        </linearGradient>
      </defs>
      {/* Folded Quilt / Pillows Stack */}
      {/* Top Pillow */}
      <rect x="12" y="10" width="24" height="10" rx="5" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="1" />
      <circle cx="24" cy="15" r="1.5" fill="#38BDF8" opacity="0.7" />
      {/* Folded Duvet Body */}
      <rect x="8" y="18" width="32" height="12" rx="4" fill="url(#quiltTeal)" />
      <rect x="6" y="28" width="36" height="12" rx="4" fill="#0F766E" />
      {/* Geometric Diamond Quilting Pattern */}
      <path d="M12 24L20 18L28 24L36 18" stroke="#99F6E4" strokeWidth="1" opacity="0.7" />
      <path d="M10 34L18 28L26 34L34 28" stroke="#5EEAD4" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

// ============================================================================
// 4. REALISTIC 3D TRUST BADGES (Shield, Van, Stopwatch, Medal)
// ============================================================================

export function RealisticShieldBadge({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx('drop-shadow-md', className)}>
      <defs>
        <linearGradient id="shieldGrad" x1="12" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.5" stopColor="#0284C7" />
          <stop offset="1" stopColor="#0369A1" />
        </linearGradient>
      </defs>
      {/* 3D Shield Shell */}
      <path
        d="M24 6L10 11V22C10 32 16 39 24 43C32 39 38 32 38 22V11L24 6Z"
        fill="url(#shieldGrad)"
      />
      {/* Inner Specular Rim */}
      <path
        d="M24 9L13 13V22C13 30 18 36 24 40C30 36 35 30 35 22V13L24 9Z"
        stroke="#BAE6FD"
        strokeWidth="1.5"
        opacity="0.8"
      />
      {/* Clean Sparkle Checkmark */}
      <path
        d="M18 23L22 27L30 18"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RealisticVanBadge({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx('drop-shadow-md', className)}>
      <defs>
        <linearGradient id="vanGrad" x1="8" y1="12" x2="40" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="0.6" stopColor="#059669" />
          <stop offset="1" stopColor="#065F46" />
        </linearGradient>
      </defs>
      {/* Van Body */}
      <path
        d="M8 16C8 14.9 8.9 14 10 14H28V32H8V16Z"
        fill="url(#vanGrad)"
      />
      {/* Van Cab Front */}
      <path
        d="M28 18H34L40 25V32H28V18Z"
        fill="#047857"
      />
      {/* Windshield */}
      <path d="M29 20H33L37 25H29V20Z" fill="#E0F2FE" />
      {/* Wheels */}
      <circle cx="16" cy="33" r="5" fill="#1E293B" />
      <circle cx="16" cy="33" r="2.2" fill="#E2E8F0" />
      <circle cx="34" cy="33" r="5" fill="#1E293B" />
      <circle cx="34" cy="33" r="2.2" fill="#E2E8F0" />
      {/* Speed trails */}
      <line x1="4" y1="20" x2="6" y2="20" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="25" x2="5" y2="25" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function RealisticClockBadge({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx('drop-shadow-md', className)}>
      <defs>
        <linearGradient id="clockGold" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.6" stopColor="#D97706" />
          <stop offset="1" stopColor="#92400E" />
        </linearGradient>
      </defs>
      {/* Stopwatch Crown */}
      <rect x="22" y="4" width="4" height="4" rx="1" fill="#D97706" />
      <circle cx="24" cy="26" r="18" fill="url(#clockGold)" />
      {/* Sapphire Glass Face */}
      <circle cx="24" cy="26" r="14" fill="#FEF3C7" />
      {/* Ticks */}
      <line x1="24" y1="15" x2="24" y2="17" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="26" x2="33" y2="26" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="37" x2="24" y2="35" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
      <line x1="13" y1="26" x2="15" y2="26" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
      {/* Clock Hands */}
      <line x1="24" y1="26" x2="24" y2="18" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="26" x2="30" y2="26" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="26" r="2" fill="#DC2626" />
    </svg>
  );
}

export function RealisticMedalBadge({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx('drop-shadow-md', className)}>
      <defs>
        <linearGradient id="medalGold" x1="12" y1="18" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.5" stopColor="#EAB308" />
          <stop offset="1" stopColor="#A16207" />
        </linearGradient>
      </defs>
      {/* Silk Ribbons Top */}
      <polygon points="16,6 24,18 20,18 12,6" fill="#2563EB" />
      <polygon points="32,6 24,18 28,18 36,6" fill="#DC2626" />
      {/* Golden Medallion */}
      <circle cx="24" cy="28" r="14" fill="url(#medalGold)" />
      <circle cx="24" cy="28" r="11" stroke="#FEF08A" strokeWidth="1.5" />
      {/* Star Center */}
      <polygon
        points="24,21 26.5,25.5 31,26.5 28,29.5 28.8,34.5 24,32 19.2,34.5 20,29.5 17,26.5 21.5,25.5"
        fill="#FFFFFF"
      />
    </svg>
  );
}
