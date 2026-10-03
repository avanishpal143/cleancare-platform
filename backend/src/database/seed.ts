// Re-export from root seed file
// This file exists so ts-node can find it from backend/src/database/

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CleanCare database...');

  // ── Settings ──────────────────────────────────────────────
  const settings = [
    { key: 'app.name',        value: 'CleanCare',                     category: 'general',  isPublic: true  },
    { key: 'app.tagline',     value: 'Fresh Clothes. Brighter Days.',  category: 'general',  isPublic: true  },
    { key: 'tax.rate',        value: '18',                             category: 'pricing',  isPublic: false },
    { key: 'service.charge',  value: '50',                             category: 'pricing',  isPublic: false },
    { key: 'delivery.charge', value: '0',                              category: 'pricing',  isPublic: false },
    { key: 'cod.enabled',     value: 'true',                           category: 'payments', isPublic: true  },
    { key: 'support.phone',   value: '+91 9800000001',                 category: 'general',  isPublic: true  },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, create: s, update: { value: s.value } });
  }
  console.log('✅ Settings');

  // ── Slots ─────────────────────────────────────────────────
  const slots = [
    { label: '10 AM - 12 PM', startTime: '10:00', endTime: '12:00' },
    { label: '12 PM - 2 PM',  startTime: '12:00', endTime: '14:00' },
    { label: '4 PM - 6 PM',   startTime: '16:00', endTime: '18:00' },
  ];
  for (const s of slots) {
    const existing = await prisma.pickupSlot.findFirst({ where: { label: s.label } });
    if (!existing) await prisma.pickupSlot.create({ data: { ...s, dayOfWeek: [] } });
    const existingD = await prisma.deliverySlot.findFirst({ where: { label: s.label } });
    if (!existingD) await prisma.deliverySlot.create({ data: { ...s, dayOfWeek: [] } });
  }
  console.log('✅ Slots');

  // ── Serviceable Areas ─────────────────────────────────────
  const areas = [
    { pincode: '302001', area: 'Jaipur City',    city: 'Jaipur', state: 'Rajasthan',   isCodEnabled: true },
    { pincode: '302020', area: 'Mansarovar',     city: 'Jaipur', state: 'Rajasthan',   isCodEnabled: true },
    { pincode: '400001', area: 'South Mumbai',   city: 'Mumbai', state: 'Maharashtra', isCodEnabled: true },
  ];
  for (const a of areas) {
    await prisma.serviceableArea.upsert({ where: { pincode: a.pincode }, create: a, update: {} });
  }
  console.log('✅ Serviceable areas');

  // ── Processing Center ─────────────────────────────────────
  let center = await prisma.processingCenter.findFirst();
  if (!center) {
    center = await prisma.processingCenter.create({
      data: { name: 'CleanCare Jaipur Center', address: '45 Industrial Area', city: 'Jaipur', pincode: '302001' },
    });
  }
  console.log('✅ Processing center');

  // ── Services ──────────────────────────────────────────────
  const services = [
    { name: 'Dry Cleaning',     slug: 'dry-cleaning',     description: 'Premium cleaning for your special clothes', basePrice: 50,  unit: 'PER_ITEM' as const, turnaroundDays: 2, isActive: true,  sortOrder: 1 },
    { name: 'Laundry',          slug: 'laundry',          description: 'Everyday fresh and clean',                   basePrice: 40,  unit: 'PER_KG'   as const, turnaroundDays: 1, isActive: true,  sortOrder: 2 },
    { name: 'Ironing',          slug: 'ironing',          description: 'Crisp and neat every time',                  basePrice: 30,  unit: 'PER_ITEM' as const, turnaroundDays: 1, isActive: true,  sortOrder: 3 },
    { name: 'Shoe Cleaning',    slug: 'shoe-cleaning',    description: 'Deep clean for all footwear',                basePrice: 100, unit: 'PER_PAIR' as const, turnaroundDays: 3, isActive: true,  sortOrder: 4 },
    { name: 'Curtain Cleaning', slug: 'curtain-cleaning', description: 'Fresh curtains, brighter rooms',            basePrice: 150, unit: 'PER_PANEL'as const, turnaroundDays: 3, isActive: false, sortOrder: 5 },
    { name: 'Bag Cleaning',     slug: 'bag-cleaning',     description: 'Restore your bags to like-new',             basePrice: 100, unit: 'PER_ITEM' as const, turnaroundDays: 2, isActive: true,  sortOrder: 6 },
    { name: 'Special Care',     slug: 'special-care',     description: 'Sarees, suits, jackets and delicate items', basePrice: 120, unit: 'PER_ITEM' as const, turnaroundDays: 3, isActive: true,  sortOrder: 7 },
  ];
  const serviceMap: Record<string, string> = {};
  for (const s of services) {
    const svc = await prisma.service.upsert({ where: { slug: s.slug }, create: s, update: { isActive: s.isActive } });
    serviceMap[s.slug] = svc.id;
  }
  console.log('✅ Services');

  // ── Garments ──────────────────────────────────────────────
  const garments: Record<string, { name: string; unitPrice: number; sortOrder: number }[]> = {
    'dry-cleaning': [
      { name: 'Shirt',   unitPrice: 60,  sortOrder: 1 },
      { name: 'Trouser', unitPrice: 70,  sortOrder: 2 },
      { name: 'Suit',    unitPrice: 150, sortOrder: 3 },
      { name: 'Saree',   unitPrice: 120, sortOrder: 4 },
      { name: 'Jacket',  unitPrice: 100, sortOrder: 5 },
      { name: 'Blanket', unitPrice: 200, sortOrder: 6 },
    ],
    'laundry': [
      { name: 'Shirt',    unitPrice: 20, sortOrder: 1 },
      { name: 'T-Shirt',  unitPrice: 15, sortOrder: 2 },
      { name: 'Trouser',  unitPrice: 25, sortOrder: 3 },
      { name: 'Jeans',    unitPrice: 30, sortOrder: 4 },
      { name: 'Bedsheet', unitPrice: 40, sortOrder: 5 },
    ],
    'ironing': [
      { name: 'Shirt',   unitPrice: 15, sortOrder: 1 },
      { name: 'Trouser', unitPrice: 15, sortOrder: 2 },
      { name: 'Suit',    unitPrice: 40, sortOrder: 3 },
      { name: 'Saree',   unitPrice: 30, sortOrder: 4 },
    ],
    'shoe-cleaning': [
      { name: 'Sneakers',     unitPrice: 100, sortOrder: 1 },
      { name: 'Formal Shoes', unitPrice: 120, sortOrder: 2 },
      { name: 'Boots',        unitPrice: 150, sortOrder: 3 },
    ],
    'curtain-cleaning': [
      { name: 'Single Curtain', unitPrice: 150, sortOrder: 1 },
      { name: 'Double Curtain', unitPrice: 250, sortOrder: 2 },
    ],
    'bag-cleaning': [
      { name: 'Handbag',  unitPrice: 100, sortOrder: 1 },
      { name: 'Backpack', unitPrice: 120, sortOrder: 2 },
    ],
    'special-care': [
      { name: 'Saree',        unitPrice: 120, sortOrder: 1 },
      { name: 'Suit',         unitPrice: 150, sortOrder: 2 },
      { name: 'Wedding Dress',unitPrice: 500, sortOrder: 3 },
    ],
  };
  for (const [slug, gList] of Object.entries(garments)) {
    const serviceId = serviceMap[slug];
    if (!serviceId) continue;
    for (const g of gList) {
      const sku = `${slug}-${g.name.toLowerCase().replace(/\s+/g, '-')}`;
      await prisma.garment.upsert({
        where:  { skuCode: sku },
        create: { serviceId, name: g.name, slug: g.name.toLowerCase().replace(/\s+/g, '-'), unitPrice: g.unitPrice, sortOrder: g.sortOrder, skuCode: sku },
        update: { unitPrice: g.unitPrice },
      });
    }
  }
  console.log('✅ Garments');

  // ── Admin Users ────────────────────────────────────────────
  const admins = [
    { mobile: '9800000001', name: 'Super Admin',        role: 'SUPER_ADMIN'        },
    { mobile: '9800000002', name: 'Ops Manager',        role: 'OPERATIONS_MANAGER' },
    { mobile: '9800000003', name: 'QC Specialist',      role: 'QC_USER'            },
    { mobile: '9800000004', name: 'Support Agent',      role: 'SUPPORT_AGENT'      },
  ];
  for (const u of admins) {
    await prisma.user.upsert({
      where:  { mobile: u.mobile },
      create: { mobile: u.mobile, name: u.name, role: u.role as any, isActive: true, isVerified: true },
      update: {},
    });
  }
  console.log('✅ Admin users');

  // ── Demo Customers ────────────────────────────────────────
  const customers = [
    { mobile: '9876543210', name: 'Rahul Sharma' },
    { mobile: '9876511111', name: 'Priya Singh'  },
    { mobile: '9876500003', name: 'Amit Verma'   },
  ];
  for (const c of customers) {
    const user = await prisma.user.upsert({
      where:  { mobile: c.mobile },
      create: { mobile: c.mobile, name: c.name, role: 'CUSTOMER', isActive: true, isVerified: true },
      update: {},
    });
    const customer = await prisma.customer.upsert({
      where:  { userId: user.id },
      create: { userId: user.id, name: c.name, mobile: c.mobile },
      update: {},
    });
    const existing = await prisma.address.findFirst({ where: { customerId: customer.id } });
    if (!existing) {
      await prisma.address.create({
        data: { customerId: customer.id, label: 'Home', type: 'HOME', line1: '123, Mansarovar', city: 'Jaipur', state: 'Rajasthan', pincode: '302020', isDefault: true },
      });
    }
  }
  console.log('✅ Customers');

  // ── Demo Drivers ──────────────────────────────────────────
  const drivers = [
    { mobile: '9876500010', name: 'Rakesh Meena', vehicle: 'Bike', vehicleNo: 'RJ14-AB-1234' },
    { mobile: '9876500011', name: 'Sunil Sharma', vehicle: 'Bike', vehicleNo: 'RJ14-CD-5678' },
  ];
  for (const d of drivers) {
    const user = await prisma.user.upsert({
      where:  { mobile: d.mobile },
      create: { mobile: d.mobile, name: d.name, role: 'DRIVER', isActive: true, isVerified: true },
      update: {},
    });
    await prisma.driver.upsert({
      where:  { userId: user.id },
      create: { userId: user.id, name: d.name, mobile: d.mobile, vehicleType: d.vehicle, vehicleNumber: d.vehicleNo, isActive: true, isAvailable: true, processingCenterId: center.id },
      update: {},
    });
  }
  console.log('✅ Drivers');

  // ── Coupons ───────────────────────────────────────────────
  await prisma.coupon.upsert({
    where:  { code: 'FIRST20' },
    create: { code: 'FIRST20', name: '20% Off First Order', type: 'PERCENTAGE', value: 20, minOrderValue: 100, maxDiscountAmt: 200, usageLimit: 1000, isFirstOrder: true, isActive: true, validFrom: new Date('2026-01-01'), validUntil: new Date('2027-12-31') },
    update: {},
  });
  await prisma.coupon.upsert({
    where:  { code: 'FLAT50' },
    create: { code: 'FLAT50', name: '₹50 Off', type: 'FLAT', value: 50, minOrderValue: 300, isFirstOrder: false, isActive: true, validFrom: new Date('2026-01-01'), validUntil: new Date('2027-12-31') },
    update: {},
  });
  console.log('✅ Coupons');

  console.log('\n🎉 Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Dev OTP:    123456  (for all mobiles)');
  console.log('Admin:      +91 9800000001');
  console.log('Driver:     +91 9876500010  (Rakesh)');
  console.log('Customer:   +91 9876543210  (Rahul)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
