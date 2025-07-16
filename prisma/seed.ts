import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create plans
  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { id: 'plan_starter' },
      update: {},
      create: {
        id: 'plan_starter',
        name: 'Starter',
        priceMonthly: 29,
        seatLimit: 5,
      },
    }),
    prisma.plan.upsert({
      where: { id: 'plan_growth' },
      update: {},
      create: {
        id: 'plan_growth',
        name: 'Growth',
        priceMonthly: 99,
        seatLimit: 25,
      },
    }),
    prisma.plan.upsert({
      where: { id: 'plan_enterprise' },
      update: {},
      create: {
        id: 'plan_enterprise',
        name: 'Enterprise',
        priceMonthly: 299,
        seatLimit: 100,
      },
    }),
  ]);

  console.log('✅ Plans created:', plans.map(p => p.name));

  // Create a demo subscription
  const demoSubscription = await prisma.subscription.upsert({
    where: { id: 'demo_subscription' },
    update: {},
    create: {
      id: 'demo_subscription',
      tenantId: 'demo-tenant-id',
      planId: 'plan_growth',
      status: 'active',
      seats: 10,
      gateway: 'stripe',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      gatewayCus: 'cus_demo_customer',
      gatewaySub: 'sub_demo_subscription',
      autoRenew: true,
    },
  });

  console.log('✅ Demo subscription created');

  // Create demo invoices
  const invoices = await Promise.all([
    prisma.invoice.upsert({
      where: { id: 'invoice_1' },
      update: {},
      create: {
        id: 'invoice_1',
        subscriptionId: 'demo_subscription',
        amount: 99000, // $990.00 in cents
        status: 'paid',
        pdfUrl: 'https://example.com/invoice1.pdf',
        issuedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
    }),
    prisma.invoice.upsert({
      where: { id: 'invoice_2' },
      update: {},
      create: {
        id: 'invoice_2',
        subscriptionId: 'demo_subscription',
        amount: 99000, // $990.00 in cents
        status: 'paid',
        pdfUrl: 'https://example.com/invoice2.pdf',
        issuedAt: new Date(),
      },
    }),
  ]);

  console.log('✅ Demo invoices created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 