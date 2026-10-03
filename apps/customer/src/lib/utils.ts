import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format, isToday, isTomorrow, isYesterday } from 'date-fns';
import type { OrderStatus } from '@cleancare/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date))     return `Today, ${format(date, 'h:mm a')}`;
  if (isYesterday(date)) return `Yesterday, ${format(date, 'h:mm a')}`;
  if (isTomorrow(date))  return `Tomorrow, ${format(date, 'h:mm a')}`;
  return format(date, 'd MMM yyyy');
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'dd MMM yyyy');
}

export function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), 'dd MMM yyyy, h:mm a');
}

export function formatTime(dateStr: string): string {
  return format(new Date(dateStr), 'h:mm a');
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    BOOKED:             'Booked',
    PICKUP_ASSIGNED:    'Pickup Assigned',
    PICKED_UP:          'Picked Up',
    RECEIVED:           'Received',
    PROCESSING:         'Processing',
    QC:                 'Quality Check',
    PACKED:             'Packed',
    READY_FOR_DELIVERY: 'Ready',
    OUT_FOR_DELIVERY:   'Out for Delivery',
    DELIVERED:          'Delivered',
    COMPLETED:          'Completed',
    CANCELLED:          'Cancelled',
  };
  return labels[status] ?? status;
}

export function getStatusChipClass(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    BOOKED:             'chip-info',
    PICKUP_ASSIGNED:    'chip-warning',
    PICKED_UP:          'chip-warning',
    RECEIVED:           'chip-info',
    PROCESSING:         'chip-warning',
    QC:                 'chip-purple',
    PACKED:             'chip-success',
    READY_FOR_DELIVERY: 'chip-success',
    OUT_FOR_DELIVERY:   'chip-orange',
    DELIVERED:          'chip-success',
    COMPLETED:          'chip-success',
    CANCELLED:          'chip-danger',
  };
  return map[status] ?? 'chip-neutral';
}

// Order lifecycle index (for timeline)
const ORDER_STATUSES: OrderStatus[] = [
  'BOOKED',
  'PICKUP_ASSIGNED',
  'PICKED_UP',
  'RECEIVED',
  'PROCESSING',
  'QC',
  'PACKED',
  'READY_FOR_DELIVERY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'COMPLETED',
];

export function getOrderStatusIndex(status: OrderStatus): number {
  return ORDER_STATUSES.indexOf(status);
}

export function isStatusComplete(current: OrderStatus, check: OrderStatus): boolean {
  return getOrderStatusIndex(current) > getOrderStatusIndex(check);
}

export function isStatusActive(current: OrderStatus, check: OrderStatus): boolean {
  return current === check;
}

export function truncate(str: string, len = 40): string {
  return str.length > len ? str.slice(0, len) + '…' : str;
}

export function generateInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
