import { Injectable, BadRequestException } from '@nestjs/common';
import type { OrderStatus, UserRole } from '@cleancare/types';

// ---- Allowed transitions ----
const TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  BOOKED:             ['PICKUP_ASSIGNED', 'CANCELLED'],
  PICKUP_ASSIGNED:    ['PICKED_UP', 'BOOKED', 'CANCELLED'],
  PICKED_UP:          ['RECEIVED'],
  RECEIVED:           ['PROCESSING'],
  PROCESSING:         ['QC'],
  QC:                 ['PACKED', 'PROCESSING'],  // PROCESSING = reprocess
  PACKED:             ['READY_FOR_DELIVERY'],
  READY_FOR_DELIVERY: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY:   ['DELIVERED', 'READY_FOR_DELIVERY'],
  DELIVERED:          ['COMPLETED'],
  COMPLETED:          [],
  CANCELLED:          [],
};

// ---- Roles allowed to make each transition ----
const TRANSITION_ROLES: Partial<Record<string, UserRole[]>> = {
  'BOOKED→PICKUP_ASSIGNED':        ['ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER'],
  'BOOKED→CANCELLED':              ['ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','CUSTOMER'],
  'PICKUP_ASSIGNED→PICKED_UP':     ['DRIVER'],
  'PICKUP_ASSIGNED→BOOKED':        ['ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER'],
  'PICKUP_ASSIGNED→CANCELLED':     ['ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER'],
  'PICKED_UP→RECEIVED':            ['ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','PROCESSING_MANAGER'],
  'RECEIVED→PROCESSING':           ['ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','PROCESSING_MANAGER'],
  'PROCESSING→QC':                 ['ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','PROCESSING_MANAGER','QC_USER'],
  'QC→PACKED':                     ['ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','PROCESSING_MANAGER','QC_USER'],
  'QC→PROCESSING':                 ['ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','PROCESSING_MANAGER','QC_USER'],
  'PACKED→READY_FOR_DELIVERY':     ['ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','PROCESSING_MANAGER'],
  'READY_FOR_DELIVERY→OUT_FOR_DELIVERY': ['ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER'],
  'OUT_FOR_DELIVERY→DELIVERED':    ['DRIVER'],
  'OUT_FOR_DELIVERY→READY_FOR_DELIVERY': ['ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER'],
  'DELIVERED→COMPLETED':           ['DRIVER','ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER'],
};

@Injectable()
export class OrderStateMachine {
  canTransition(from: OrderStatus, to: OrderStatus): boolean {
    const allowed = TRANSITIONS[from] ?? [];
    return allowed.includes(to);
  }

  assertTransition(from: OrderStatus, to: OrderStatus, role: UserRole): void {
    if (from === 'COMPLETED' || from === 'CANCELLED') {
      throw new BadRequestException(
        `Cannot transition order from terminal state: ${from}`
      );
    }

    // Admins and Operations Managers have full workflow authority to update orders
    if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'OPERATIONS_MANAGER') {
      return;
    }

    if (!this.canTransition(from, to)) {
      throw new BadRequestException(
        `Invalid order transition: ${from} → ${to}`
      );
    }

    const key = `${from}→${to}`;
    const allowedRoles = TRANSITION_ROLES[key];
    if (allowedRoles && !allowedRoles.includes(role)) {
      throw new BadRequestException(
        `Role ${role} cannot transition order from ${from} to ${to}`
      );
    }
  }

  getNextStatuses(current: OrderStatus): OrderStatus[] {
    return TRANSITIONS[current] ?? [];
  }

  isTerminal(status: OrderStatus): boolean {
    return status === 'COMPLETED' || status === 'CANCELLED';
  }
}
