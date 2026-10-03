/**
 * CleanCare — Development Seed Data
 * Run: yarn workspace @cleancare/backend db:seed
 *
 * Values from UI reference screens used as demo data.
 * These are NOT hardcoded in any component — they come from DB.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CleanCare database...');

  // ============================================================
  // SETTINGS
  // ============================================================
  const settings = [
    { key: 'app.name',               value: 'CleanCare',      category: 'general',  isPublic: true },
    { key: 'app.tagline',            value: 'Fresh Clothes. Brighter Days.', category: 'general', isPublic: true },
    { key: 'tax.rate',               value: '18',             category: 'pricing',  isPublic: false },
    { key: 'service.charge',         value: '50',             category: 'pricing',  isPublic: false },
    { key: 'delivery.charge',        value: '0',              category: 'pricing',  isPublic: false },
    { key: 'order.min.value',        value: '100',            category: 'orders',   isPublic: false },
    { key: 'cod.enabled',            value: 'true',           category: 'payments', isPublic: true },
    { key: 'otp.expiry.minutes',     value: '10',             category: 'security', isPublic: false },
    { key: 'cancellation.allowed.before.pickup', value: 'true', category: 'orders', isPublic: true },
    { key: 'support.email',          value: 'support@cleancare.app', category: 'general', isPublic: true },
    { key: 'support.phone',          value: '+91 9800000001', category: 'general',  isPublic: true },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, create: s, update: { value: s.value } });
  }
  console.log('✅ Settings seeded');

  // ============================================================
  // PICKUP & DELIVERY SLOTS
  // ============================================================
  const pickupSlots = [
    { label: '10 AM - 12 PM', startTime: '10:00', endTime: '12:00' },
    { label: '12 PM - 2 PM',  startTime: '12:00', endTime: '14:00' },
    { label: '4 PM - 6 PM',   startTime: '16:00', endTime: '18:00' },
  ];
  const deliverySlots = [
    { label: '10 AM - 12 PM', startTime: '10:00', endTime: '12:00' },
    { label: '12 PM - 2 PM',  startTime: '12:00', endTime: '14:00' },
    { label: '4 PM - 6 PM',   startTime: '16:00', endTime: '18:00' },
  ];
  for (const s of pickupSlots)   await prisma.pickupSlot.create({ data: { ...s, dayOfWeek: [] } });
  for (const s of deliverySlots) await prisma.deliverySlot.create({ data: { ...s, dayOfWeek: [] } });
  console.log('✅ Slots seeded');

  // ============================================================
  // SERVICEABLE AREAS
  // ============================================================
  const areas = [
    { pincode: '302001', area: 'Jaipur City',    city: 'Jaipur', state: 'Rajasthan', isCodEnabled: true },
    { pincode: '302002', area: 'Vaishali Nagar', city: 'Jaipur', state: 'Rajasthan', isCodEnabled: true },
    { pincode: '302003', area: 'Mansarovar',     city: 'Jaipur', state: 'Rajasthan', isCodEnabled: true },
    { pincode: '400001', area: 'South Mumbai',   city: 'Mumbai', state: 'Maharashtra', isCodEnabled: true },
    { pincode: '110001', area: 'Connaught Place',city: 'Delhi',  state: 'Delhi',      isCodEnabled: false },
  ];
  for (const a of areas) {
    await prisma.serviceableArea.upsert({ where: { pincode: a.pincode }, create: a, update: {} });
  }
  console.log('✅ Serviceable areas seeded');

  // ============================================================
  // PROCESSING CENTER
  // ============================================================
  const center = await prisma.processingCenter.create({
    data: {
      name:    'CleanCare Jaipur Center',
      address: '45 Industrial Area',
      city:    'Jaipur',
      pincode: '302001',
      phone:   '+91 9800000002',
      email:   'jaipur@cleancare.app',
    },
  });
  console.log('✅ Processing center seeded');

  // ============================================================
  // SERVICES (from reference design)
  // ============================================================
  const services = [
    { name: 'Dry Cleaning',     slug: 'dry-cleaning',     description: 'Premium cleaning for your special clothes', basePrice: 50,  unit: 'PER_ITEM' as const, turnaroundDays: 2, isActive: true,  sortOrder: 1 },
    { name: 'Laundry',          slug: 'laundry',          description: 'Everyday fresh and clean',                   basePrice: 40,  unit: 'PER_KG'   as const, turnaroundDays: 1, isActive: true,  sortOrder: 2 },
    { name: 'Ironing',          slug: 'ironing',          description: 'Crisp and neat every time',                  basePrice: 30,  unit: 'PER_ITEM' as const, turnaroundDays: 1, isActive: true,  sortOrder: 3 },
    { name: 'Shoe Cleaning',    slug: 'shoe-cleaning',    description: 'Deep clean for all footwear',                basePrice: 100, unit: 'PER_PAIR' as const, turnaroundDays: 3, isActive: true,  sortOrder: 4 },
    { name: 'Curtain Cleaning', slug: 'curtain-cleaning', description: 'Fresh curtains, brighter rooms',            basePrice: 150, unit: 'PER_PANEL'as const, turnaroundDays: 3, isActive: false, sortOrder: 5 },
    { name: 'Bag Cleaning',     slug: 'bag-cleaning',     description: 'Restore your bags to like-new',             basePrice: 100, unit: 'PER_ITEM' as const, turnaroundDays: 2, isActive: true,  sortOrder: 6 },
    { name: 'Special Care',     slug: 'special-care',     description: 'Sarees, suits, jackets and delicate items', basePrice: 120, unit: 'PER_ITEM' as const, turnaroundDays: 3, isActive: true,  sortOrder: 7 },
  ];

  const createdServices: Record<string, string> = {};
  for (const s of services) {
    const svc = await prisma.service.upsert({ where: { slug: s.slug }, create: s, update: { isActive: s.isActive, basePrice: s.basePrice } });
    createdServices[s.slug] = svc.id;
  }
  console.log('✅ Services seeded');

  // ============================================================
  // GARMENTS (per service)
  // ============================================================
  const garmentsByService: Record<string, { name: string; unitPrice: number; sortOrder: number }[]> = {
    'dry-cleaning': [
      { name: 'Shirt',   unitPrice: 60,  sortOrder: 1 },
      { name: 'Trouser', unitPrice: 70,  sortOrder: 2 },
      { name: 'Suit',    unitPrice: 150, sortOrder: 3 },
      { name: 'Saree',   unitPrice: 120, sortOrder: 4 },
      { name: 'Jacket',  unitPrice: 100, sortOrder: 5 },
      { name: 'Blanket', unitPrice: 200, sortOrder: 6 },
      { name: 'Kurti',   unitPrice: 60,  sortOrder: 7 },
      { name: 'Lehenga', unitPrice: 300, sortOrder: 8 },
      { name: 'Sherwani',unitPrice: 400, sortOrder: 9 },
    ],
    'laundry': [
      { name: 'Shirt',      unitPrice: 20, sortOrder: 1 },
      { name: 'T-Shirt',    unitPrice: 15, sortOrder: 2 },
      { name: 'Trouser',    unitPrice: 25, sortOrder: 3 },
      { name: 'Jeans',      unitPrice: 30, sortOrder: 4 },
      { name: 'Kurta',      unitPrice: 20, sortOrder: 5 },
      { name: 'Bedsheet',   unitPrice: 40, sortOrder: 6 },
      { name: 'Pillowcase', unitPrice: 15, sortOrder: 7 },
      { name: 'Towel',      unitPrice: 20, sortOrder: 8 },
    ],
    'ironing': [
      { name: 'Shirt',   unitPrice: 15, sortOrder: 1 },
      { name: 'T-Shirt', unitPrice: 10, sortOrder: 2 },
      { name: 'Trouser', unitPrice: 15, sortOrder: 3 },
      { name: 'Suit',    unitPrice: 40, sortOrder: 4 },
      { name: 'Saree',   unitPrice: 30, sortOrder: 5 },
      { name: 'Kurta',   unitPrice: 15, sortOrder: 6 },
    ],
    'shoe-cleaning': [
      { name: 'Sneakers',    unitPrice: 100, sortOrder: 1 },
      { name: 'Formal Shoes',unitPrice: 120, sortOrder: 2 },
      { name: 'Sports Shoes',unitPrice: 100, sortOrder: 3 },
      { name: 'Sandals',     unitPrice: 80,  sortOrder: 4 },
      { name: 'Boots',       unitPrice: 150, sortOrder: 5 },
    ],
    'curtain-cleaning': [
      { name: 'Single Curtain', unitPrice: 150, sortOrder: 1 },
      { name: 'Double Curtain', unitPrice: 250, sortOrder: 2 },
      { name: 'Sheer Curtain',  unitPrice: 120, sortOrder: 3 },
    ],
    'bag-cleaning': [
      { name: 'Handbag',    unitPrice: 100, sortOrder: 1 },
      { name: 'Backpack',   unitPrice: 120, sortOrder: 2 },
      { name: 'Clutch',     unitPrice: 80,  sortOrder: 3 },
      { name: 'Suitcase',   unitPrice: 200, sortOrder: 4 },
    ],
    'special-care': [
      { name: 'Saree',          unitPrice: 120, sortOrder: 1 },
      { name: 'Suit',           unitPrice: 150, sortOrder: 2 },
      { name: 'Jacket',         unitPrice: 100, sortOrder: 3 },
      { name: 'Wedding Dress',  unitPrice: 500, sortOrder: 4 },
      { name: 'Blanket',        unitPrice: 200, sortOrder: 5 },
    ],
  };

  for (const [slug, garments] of Object.entries(garmentsByService)) {
    const serviceId = createdServices[slug];
    if (!serviceId) continue;
    for (const g of garments) {
      const gSlug = g.name.toLowerCase().replace(/\s+/g, '-');
      await prisma.garment.upsert({
        where:  { skuCode: `${slug}-${gSlug}` },
        create: { serviceId, name: g.name, slug: gSlug, unitPrice: g.unitPrice, sortOrder: g.sortOrder, skuCode: `${slug}-${gSlug}` },
        update: { unitPrice: g.unitPrice },
      });
    }
  }
  console.log('✅ Garments seeded');

  // ============================================================
  // ADMIN USERS
  // ============================================================
  const adminUsers = [
    { mobile: '9800000001', name: 'Super Admin',          role: 'SUPER_ADMIN'        },
    { mobile: '9800000002', name: 'Ops Manager',          role: 'OPERATIONS_MANAGER' },
    { mobile: '9800000003', name: 'Processing Manager',   role: 'PROCESSING_MANAGER' },
    { mobile: '9800000004', name: 'QC Specialist',        role: 'QC_USER'            },
    { mobile: '9800000005', name: 'Support Agent',        role: 'SUPPORT_AGENT'      },
    { mobile: '9800000006', name: 'Finance User',         role: 'FINANCE_USER'       },
  ];

  for (const u of adminUsers) {
    await prisma.user.upsert({
      where:  { mobile: u.mobile },
      create: { mobile: u.mobile, name: u.name, role: u.role as any, isActive: true, isVerified: true },
      update: {},
    });
  }
  console.log('✅ Admin users seeded');

  // ============================================================
  // DEMO CUSTOMERS (from reference screens)
  // ============================================================
  const customers = [
    { mobile: '9876543210', name: 'Rahul Sharma',   email: 'rahul.sharma@example.com'  },
    { mobile: '9876511111', name: 'Priya Singh',    email: 'priya.singh@example.com'   },
    { mobile: '9876500001', name: 'Amit Verma',     email: 'amit.verma@example.com'    },
    { mobile: '9876500002', name: 'Neha Jain',      email: 'neha.jain@example.com'     },
    { mobile: '9876500003', name: 'Suresh Kumar',   email: 'suresh.kumar@example.com'  },
    { mobile: '9000000001', name: 'Satyanarayan',   email: null                        },
  ];

  const createdCustomers: Record<string, { userId: string; customerId: string }> = {};
  for (const c of customers) {
    const user = await prisma.user.upsert({
      where:  { mobile: c.mobile },
      create: { mobile: c.mobile, name: c.name, email: c.email ?? undefined, role: 'CUSTOMER', isActive: true, isVerified: true },
      update: {},
    });
    const customer = await prisma.customer.upsert({
      where:  { userId: user.id },
      create: { userId: user.id, name: c.name, email: c.email ?? undefined, mobile: c.mobile },
      update: {},
    });
    createdCustomers[c.mobile] = { userId: user.id, customerId: customer.id };

    // Default address
    const existing = await prisma.address.findFirst({ where: { customerId: customer.id } });
    if (!existing) {
      await prisma.address.create({
        data: {
          customerId: customer.id, label: 'Home', type: 'HOME',
          line1: '123, Mansarovar', city: 'Jaipur', state: 'Rajasthan',
          pincode: '302020', isDefault: true,
        },
      });
    }
  }
  console.log('✅ Customers seeded');

  // ============================================================
  // DEMO DRIVERS
  // ============================================================
  const drivers = [
    { mobile: '9876500010', name: 'Rakesh Meena',   vehicle: 'Bike',  vehicleNo: 'RJ14-AB-1234' },
    { mobile: '9876500011', name: 'Sunil Sharma',   vehicle: 'Bike',  vehicleNo: 'RJ14-CD-5678' },
    { mobile: '9876500012', name: 'Mohit Kumar',    vehicle: 'Scooter', vehicleNo: 'RJ14-EF-9012' },
  ];

  const createdDrivers: Record<string, string> = {};
  for (const d of drivers) {
    const user = await prisma.user.upsert({
      where:  { mobile: d.mobile },
      create: { mobile: d.mobile, name: d.name, role: 'DRIVER', isActive: true, isVerified: true },
      update: {},
    });
    const driver = await prisma.driver.upsert({
      where:  { userId: user.id },
      create: {
        userId: user.id, name: d.name, mobile: d.mobile,
        vehicleType: d.vehicle, vehicleNumber: d.vehicleNo,
        isActive: true, isAvailable: true,
        processingCenterId: center.id,
      },
      update: {},
    });
    createdDrivers[d.mobile] = driver.id;
  }
  console.log('✅ Drivers seeded');

  // ============================================================
  // DEMO COUPONS
  // ============================================================
  const coupons = [
    {
      code: 'FIRST20', name: '20% Off First Order', type: 'PERCENTAGE' as const,
      value: 20, minOrderValue: 100, maxDiscountAmt: 200,
      usageLimit: 1000, isFirstOrder: true, isActive: true,
      validFrom: new Date('2026-01-01'), validUntil: new Date('2026-12-31'),
    },
    {
      code: 'FLAT50', name: '₹50 Off',  type: 'FLAT' as const,
      value: 50, minOrderValue: 300, isFirstOrder: false, isActive: true,
      validFrom: new Date('2026-01-01'), validUntil: new Date('2026-12-31'),
    },
    {
      code: 'DRYCLEAN10', name: '10% Off Dry Cleaning', type: 'PERCENTAGE' as const,
      value: 10, minOrderValue: 200, isFirstOrder: false, isActive: true,
      serviceId: createdServices['dry-cleaning'],
      validFrom: new Date('2026-01-01'), validUntil: new Date('2026-12-31'),
    },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({ where: { code: c.code }, create: c, update: { isActive: c.isActive } });
  }
  console.log('✅ Coupons seeded');

  // ============================================================
  // DEMO ORDERS (matching reference screen data)
  // ============================================================
  const rahul     = createdCustomers['9876543210'];
  const priya     = createdCustomers['9876511111'];
  const rakeshD   = createdDrivers['9876500010'];
  const sunilD    = createdDrivers['9876500011'];
  const dryClean  = createdServices['dry-cleaning'];
  const laundry   = createdServices['laundry'];

  // Fetch some garments
  const dryCleaning = await prisma.garment.findMany({ where: { serviceId: dryClean }, take: 5 });
  const laundryG    = await prisma.garment.findMany({ where: { serviceId: laundry  }, take: 4 });

  // Rahul's address
  const rahulAddr = await prisma.address.findFirst({ where: { customerId: rahul.customerId } });

  if (rahulAddr && dryCleaning.length > 0) {
    // ORD-001 — Processing (Rahul)
    const shirt   = dryCleaning.find((g) => g.name === 'Shirt');
    const trouser = dryCleaning.find((g) => g.name === 'Trouser');
    const saree   = dryCleaning.find((g) => g.name === 'Saree');

    if (shirt && trouser && saree) {
      const order1 = await prisma.order.create({
        data: {
          orderNumber: 'ORD-001',
          customerId: rahul.customerId, serviceId: dryClean,
          pickupAddressId: rahulAddr.id, deliveryAddressId: rahulAddr.id,
          pickupDate: new Date('2026-09-22T10:00:00Z'), pickupSlotLabel: '10 AM - 12 PM',
          deliveryDate: new Date('2026-09-24T10:00:00Z'), deliverySlotLabel: '10 AM - 12 PM',
          status: 'PROCESSING', garmentCount: 8,
          subtotal: 310, serviceCharge: 50, taxAmount: 65, totalAmount: 425,
          paymentMethod: 'UPI', paymentStatus: 'PAID', processingCenterId: center.id,
          items: {
            create: [
              { garmentId: shirt.id,   garmentName: 'Shirt',   quantity: 2, unitPrice: shirt.unitPrice,   subtotal: shirt.unitPrice   * 2 },
              { garmentId: trouser.id, garmentName: 'Trouser', quantity: 1, unitPrice: trouser.unitPrice, subtotal: trouser.unitPrice * 1 },
              { garmentId: saree.id,   garmentName: 'Saree',   quantity: 1, unitPrice: saree.unitPrice,   subtotal: saree.unitPrice   * 1 },
            ],
          },
        },
      });

      // Status history
      const statuses = ['BOOKED','PICKUP_ASSIGNED','PICKED_UP','RECEIVED','PROCESSING'] as const;
      let dt = new Date('2026-09-22T09:30:00Z');
      for (const st of statuses) {
        await prisma.orderStatusHistory.create({
          data: { orderId: order1.id, status: st, createdAt: dt },
        });
        dt = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
      }

      // Payment
      await prisma.payment.create({ data: { orderId: order1.id, method: 'UPI', status: 'PAID', amount: 425, paidAt: new Date('2026-09-22T09:32:00Z') } });

      // Pickup job
      await prisma.pickupJob.create({ data: { orderId: order1.id, driverId: rakeshD, status: 'COMPLETED', scheduledAt: new Date('2026-09-22T10:00:00Z'), completedAt: new Date('2026-09-22T11:00:00Z'), otpVerified: true, collectedQty: 8, expectedQty: 8 } });

      console.log('✅ Order ORD-001 created');
    }
  }

  // Priya's address
  const priyaAddr = await prisma.address.findFirst({ where: { customerId: priya.customerId } });
  if (priyaAddr && laundryG.length > 0) {
    const order2 = await prisma.order.create({
      data: {
        orderNumber: 'ORD-002',
        customerId: priya.customerId, serviceId: laundry,
        pickupAddressId: priyaAddr.id, deliveryAddressId: priyaAddr.id,
        pickupDate: new Date('2026-09-22T12:00:00Z'), pickupSlotLabel: '12 PM - 2 PM',
        status: 'OUT_FOR_DELIVERY', garmentCount: 10,
        subtotal: 700, serviceCharge: 50, taxAmount: 126, totalAmount: 876,
        paymentMethod: 'COD', paymentStatus: 'PENDING', processingCenterId: center.id,
        items: {
          create: laundryG.slice(0, 3).map((g) => ({
            garmentId: g.id, garmentName: g.name, quantity: 3,
            unitPrice: g.unitPrice, subtotal: g.unitPrice * 3,
          })),
        },
      },
    });

    await prisma.payment.create({ data: { orderId: order2.id, method: 'COD', status: 'PENDING', amount: 876 } });
    await prisma.deliveryJob.create({ data: { orderId: order2.id, driverId: sunilD, status: 'IN_PROGRESS', scheduledAt: new Date('2026-09-22T16:00:00Z') } });
    console.log('✅ Order ORD-002 created');
  }

  // ============================================================
  // NOTIFICATION TEMPLATES
  // ============================================================
  const templates = [
    { event: 'ORDER_BOOKED',             channel: 'SMS' as const, subject: 'Order Confirmed',    body: 'Your CleanCare order {{orderNumber}} is confirmed. Pickup: {{pickupDate}}.' },
    { event: 'ORDER_PICKUP_ASSIGNED',    channel: 'SMS' as const, subject: 'Pickup Scheduled',   body: 'Driver {{driverName}} will pick up your clothes for order {{orderNumber}}.' },
    { event: 'ORDER_PICKED_UP',          channel: 'SMS' as const, subject: 'Picked Up',           body: 'Your clothes have been picked up. Order {{orderNumber}} is at our center.' },
    { event: 'ORDER_OUT_FOR_DELIVERY',   channel: 'SMS' as const, subject: 'Out for Delivery',    body: 'Your fresh clothes are on the way! Order {{orderNumber}} will be delivered soon.' },
    { event: 'ORDER_DELIVERED',          channel: 'SMS' as const, subject: 'Delivered',           body: 'Your order {{orderNumber}} has been delivered. Thank you for choosing CleanCare!' },
  ];

  for (const t of templates) {
    await prisma.notificationTemplate.upsert({ where: { event: t.event }, create: t, update: { body: t.body } });
  }
  console.log('✅ Notification templates seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Dev OTP:    123456 (for all mobiles)');
  console.log('Admin:      +91 9800000001  (SUPER_ADMIN)');
  console.log('Driver:     +91 9876500010  (Rakesh)');
  console.log('Customer:   +91 9876543210  (Rahul Sharma)');
  console.log('Customer:   +91 9876511111  (Priya Singh)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
