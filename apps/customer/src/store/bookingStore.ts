import { create } from 'zustand';
import type { ServiceDTO, GarmentDTO, AddressDTO, PriceEstimate, PaymentMethod } from '@cleancare/types';

export interface BookingItem {
  garment: GarmentDTO;
  quantity: number;
  notes?: string;
}

interface BookingState {
  // Step 1
  selectedService: ServiceDTO | null;
  // Step 2
  items: BookingItem[];
  specialInstructions: string;
  // Step 3
  pickupAddress: AddressDTO | null;
  deliveryAddress: AddressDTO | null;
  pickupDate: string;
  pickupSlot: string;
  deliveryDate: string;
  deliverySlot: string;
  // Step 4
  paymentMethod: PaymentMethod;
  couponCode: string;
  priceEstimate: PriceEstimate | null;

  // Actions
  setService: (service: ServiceDTO) => void;
  setItemQty: (garment: GarmentDTO, qty: number) => void;
  setItemNote: (garmentId: string, note: string) => void;
  setSpecialInstructions: (text: string) => void;
  setPickupAddress: (addr: AddressDTO) => void;
  setDeliveryAddress: (addr: AddressDTO) => void;
  setPickupDate: (date: string) => void;
  setPickupSlot: (slot: string) => void;
  setDeliveryDate: (date: string) => void;
  setDeliverySlot: (slot: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setCouponCode: (code: string) => void;
  setPriceEstimate: (estimate: PriceEstimate) => void;
  reset: () => void;
  totalItemCount: () => number;
}

const initialState = {
  selectedService: null,
  items: [],
  specialInstructions: '',
  pickupAddress: null,
  deliveryAddress: null,
  pickupDate: '',
  pickupSlot: '',
  deliveryDate: '',
  deliverySlot: '',
  paymentMethod: 'UPI' as PaymentMethod,
  couponCode: '',
  priceEstimate: null,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  setService: (service) => set({ selectedService: service, items: [] }),

  setItemQty: (garment, qty) => {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.garment.id === garment.id);
    if (qty <= 0) {
      if (idx >= 0) items.splice(idx, 1);
    } else if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: qty };
    } else {
      items.push({ garment, quantity: qty });
    }
    set({ items });
  },

  setItemNote: (garmentId, note) => {
    const items = get().items.map((i) =>
      i.garment.id === garmentId ? { ...i, notes: note } : i
    );
    set({ items });
  },

  setSpecialInstructions: (specialInstructions) => set({ specialInstructions }),
  setPickupAddress: (pickupAddress) => set({ pickupAddress }),
  setDeliveryAddress: (deliveryAddress) => set({ deliveryAddress }),
  setPickupDate: (pickupDate) => set({ pickupDate }),
  setPickupSlot: (pickupSlot) => set({ pickupSlot }),
  setDeliveryDate: (deliveryDate) => set({ deliveryDate }),
  setDeliverySlot: (deliverySlot) => set({ deliverySlot }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setCouponCode: (couponCode) => set({ couponCode }),
  setPriceEstimate: (priceEstimate) => set({ priceEstimate }),

  reset: () => set(initialState),

  totalItemCount: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
