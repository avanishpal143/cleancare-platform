// ============================================================
// CleanCare — Shared TypeScript Types
// Used by all apps and backend
// ============================================================

// ---- Enums (mirror Prisma enums) ----

export type UserRole =
  | 'SUPER_ADMIN' | 'ADMIN' | 'OPERATIONS_MANAGER'
  | 'PROCESSING_MANAGER' | 'QC_USER' | 'SUPPORT_AGENT'
  | 'FINANCE_USER' | 'DRIVER' | 'CUSTOMER';

export type OrderStatus =
  | 'BOOKED' | 'PICKUP_ASSIGNED' | 'PICKED_UP' | 'RECEIVED'
  | 'PROCESSING' | 'QC' | 'PACKED' | 'READY_FOR_DELIVERY'
  | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';

export type PaymentMethod = 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'COD' | 'WALLET';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
export type JobType     = 'PICKUP' | 'DELIVERY';
export type JobStatus   = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type AddressType = 'HOME' | 'OFFICE' | 'OTHER';
export type QCResult    = 'PASS' | 'FAIL' | 'DAMAGED' | 'STAINED' | 'MISSING' | 'REPROCESS';
export type ServiceUnit = 'PER_ITEM' | 'PER_KG' | 'PER_PAIR' | 'PER_PANEL' | 'PER_SET';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type NotificationChannel = 'PUSH' | 'SMS' | 'WHATSAPP' | 'EMAIL' | 'IN_APP';
export type MembershipTier = 'SILVER' | 'GOLD' | 'PLATINUM';
export type CouponType = 'PERCENTAGE' | 'FLAT' | 'FREE_DELIVERY';
export type ExceptionType =
  | 'QUANTITY_MISMATCH' | 'DAMAGED_GARMENT' | 'MISSING_GARMENT'
  | 'FAILED_QC' | 'FAILED_PAYMENT' | 'FAILED_PICKUP' | 'FAILED_DELIVERY'
  | 'CUSTOMER_UNAVAILABLE' | 'ADDRESS_ISSUE' | 'SERVICEABILITY_ISSUE';
export type ExceptionStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type ExceptionSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// ---- API Response Envelope ----

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// ---- Auth ----

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  sub: string;        // userId
  role: UserRole;
  customerId?: string;
  driverId?: string;
  iat: number;
  exp: number;
}

// ---- User ----

export interface UserDTO {
  id: string;
  mobile: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  isActive?: boolean;
  isVerified?: boolean;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

// ---- Customer ----

export interface CustomerDTO {
  id: string;
  userId: string;
  name: string;
  email?: string | null;
  mobile: string;
  avatarUrl?: string | null;
  loyaltyPoints?: number;
  isActive?: boolean;
  isBlocked?: boolean;
  createdAt: string;
  updatedAt?: string;
}



// ---- Address ----

export interface AddressDTO {
  id: string;
  customerId: string;
  label: string;
  type?: AddressType;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  lat?: number | null;
  lng?: number | null;
  isDefault: boolean;
}

export interface CreateAddressDTO {
  label?: string;
  type: AddressType;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}

// ---- Service ----

export interface ServiceDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconUrl?: string | null;
  imageUrl?: string | null;
  unit: ServiceUnit;
  basePrice: number;
  turnaroundDays: number;
  minOrderValue: number;
  isActive: boolean;
  sortOrder: number;
  garmentCount?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateServiceDTO {
  name: string;
  description?: string;
  iconUrl?: string;
  unit: ServiceUnit;
  basePrice: number;
  turnaroundDays: number;
  minOrderValue?: number;
}

// ---- Garment ----

export interface GarmentDTO {
  id: string;
  serviceId: string;
  serviceName?: string | null;
  name: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  skuCode?: string | null;
  unitPrice: number;
  minQty?: number;
  maxQty?: number | null;
  pieceCount?: number;
  unit?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}



// ---- Order ----

export interface OrderItemInput {
  garmentId: string;
  quantity: number;
  notes?: string;
}

export interface CreateOrderDTO {
  serviceId: string;
  items: OrderItemInput[];
  pickupAddressId: string;
  deliveryAddressId: string;
  pickupDate: string;       // ISO date
  pickupSlotLabel: string;
  deliveryDate?: string;
  deliverySlotLabel?: string;
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

export interface OrderItemDTO {
  id: string;
  garmentId: string;
  garmentName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: CustomerDTO;
  serviceId: string;
  service?: ServiceDTO;
  pickupAddress?: AddressDTO;
  deliveryAddress?: AddressDTO;
  pickupDate: string;
  pickupSlotLabel: string;
  deliveryDate?: string;
  deliverySlotLabel?: string;
  status: OrderStatus;
  specialInstructions?: string;
  garmentCount: number;
  items?: OrderItemDTO[];
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  serviceCharge: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  couponCode?: string;
  statusHistory?: OrderStatusHistoryDTO[];
  pickupJob?: PickupJobDTO;
  deliveryJob?: DeliveryJobDTO;
  payment?: PaymentDTO;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistoryDTO {
  id: string;
  orderId: string;
  status: OrderStatus;
  changedBy?: string;
  notes?: string;
  createdAt: string;
}

// ---- Pricing ----

export interface PriceEstimate {
  items: { garmentId: string; garmentName: string; qty: number; unitPrice: number; subtotal: number }[];
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  serviceCharge: number;
  taxAmount: number;
  taxRate: number;
  totalAmount: number;
  couponApplied?: string;
}

// ---- Driver ----

export interface DriverDTO {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  email?: string;
  avatarUrl?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  isActive: boolean;
  isAvailable: boolean;
  totalEarnings: number;
  rating: number;
  ratingCount: number;
  createdAt: string;
}

// ---- Jobs ----

export interface PickupJobDTO {
  id: string;
  orderId: string;
  driverId?: string;
  driver?: DriverDTO;
  status: JobStatus;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  otpVerified: boolean;
  photoUrl?: string;
  collectedQty?: number;
  expectedQty?: number;
  notes?: string;
  order?: Partial<OrderDTO>;
}

export interface DeliveryJobDTO {
  id: string;
  orderId: string;
  driverId?: string;
  driver?: DriverDTO;
  status: JobStatus;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  otpVerified: boolean;
  photoUrl?: string;
  deliveredQty?: number;
  codCollected?: number;
  notes?: string;
  order?: Partial<OrderDTO>;
}

// ---- Payment ----

export interface PaymentDTO {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  paidAt?: string;
  refundAmount?: number;
  refundedAt?: string;
  createdAt: string;
}

export interface InitiatePaymentDTO {
  orderId: string;
  method: PaymentMethod;
}

export interface PaymentVerifyDTO {
  orderId: string;
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
}

// ---- Invoice ----

export interface InvoiceDTO {
  id: string;
  orderId: string;
  invoiceNumber: string;
  issuedAt: string;
  pdfUrl?: string;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  serviceCharge: number;
  taxAmount: number;
  total: number;
  order?: Partial<OrderDTO>;
}

// ---- Support ----

export interface SupportTicketDTO {
  id: string;
  customerId: string;
  customer?: CustomerDTO;
  orderId?: string;
  ticketNumber: string;
  category: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: string;
  assignedTo?: string;
  messages?: TicketMessageDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessageDTO {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: UserRole;
  message: string;
  imageUrl?: string;
  isInternal: boolean;
  createdAt: string;
}

// ---- Exception ----

export interface ExceptionDTO {
  id: string;
  orderId?: string;
  garmentId?: string;
  type: ExceptionType;
  severity: ExceptionSeverity;
  description: string;
  status: ExceptionStatus;
  createdBy?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
}

// ---- Coupon ----

export interface CouponDTO {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: CouponType;
  value: number;
  minOrderValue: number;
  maxDiscountAmt?: number;
  usageLimit?: number;
  usageCount: number;
  isFirstOrder: boolean;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
}

// ---- Admin Dashboard ----

export interface DashboardKPIs {
  totalOrders: number;
  todayOrders: number;
  inProcessing: number;
  readyForDelivery: number;
  revenue: number;
  complaints: number;
  exceptions: number;
  ordersGrowth: number;
  revenueGrowth: number;
}

export interface OrdersChartData {
  date: string;
  orders: number;
  revenue: number;
}

export interface OrdersByServiceData {
  service: string;
  count: number;
  revenue: number;
}

export interface OrderStatusDistribution {
  status: OrderStatus;
  count: number;
  percentage: number;
}

// ---- Slots ----

export interface SlotDTO {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

// ---- Notification ----

export interface NotificationDTO {
  id: string;
  userId: string;
  orderId?: string;
  channel: NotificationChannel;
  subject?: string;
  body: string;
  status: string;
  createdAt: string;
}

// ---- Audit ----

export interface AuditLogDTO {
  id: string;
  userId?: string;
  userRole?: UserRole;
  action: string;
  entity: string;
  entityId: string;
  previousData?: unknown;
  newData?: unknown;
  ipAddress?: string;
  createdAt: string;
}

// ---- Settings ----

export interface SettingDTO {
  key: string;
  value: string;
  category: string;
  isPublic: boolean;
}

// ---- Driver Earnings ----

export interface DriverEarningSummary {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  completedJobs: number;
  pickups: number;
  deliveries: number;
  codCollected: number;
}

// ---- Processing ----

export interface ProcessingRecordDTO {
  id: string;
  orderId: string;
  processingCenterId: string;
  receivedBy?: string;
  receivedAt?: string;
  expectedQty: number;
  receivedQty?: number;
  qtyMismatch: boolean;
  currentStage: string;
  completedAt?: string;
  notes?: string;
}

export interface QCRecordDTO {
  id: string;
  orderId: string;
  garmentId?: string;
  garmentName?: string;
  result: QCResult;
  checkedBy?: string;
  checkedAt: string;
  notes?: string;
  imageUrl?: string;
  requiresReprocess: boolean;
  resolvedAt?: string;
}
