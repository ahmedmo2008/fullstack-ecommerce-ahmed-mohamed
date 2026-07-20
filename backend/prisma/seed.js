const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const customerPassword = await bcrypt.hash('Customer123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@aterra.shop' },
    update: {},
    create: {
      name: 'Aterra Admin',
      email: 'admin@aterra.shop',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@aterra.shop' },
    update: {},
    create: {
      name: 'Sample Customer',
      email: 'customer@aterra.shop',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });

  await prisma.cart.upsert({
    where: { userId: customer.id },
    update: {},
    create: { userId: customer.id },
  });

  const categoryData = [
    { name: 'Ceramics', slug: 'ceramics' },
    { name: 'Textiles', slug: 'textiles' },
    { name: 'Tools', slug: 'tools' },
    { name: 'Lighting', slug: 'lighting' },
  ];

  const categories = [];
  for (const c of categoryData) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categories.push(category);
  }

  const productData = [
    { name: 'Stoneware Pour-Over Set', description: 'Hand-thrown stoneware pour-over dripper with matching mug.', price: 48.0, stock: 20, category: 'ceramics' },
    { name: 'Speckled Dinner Plate', description: 'Reactive-glaze stoneware plate, food safe and dishwasher friendly.', price: 22.0, stock: 40, category: 'ceramics' },
    { name: 'Linen Table Runner', description: '100% stonewashed linen runner, 14x72 inches.', price: 36.0, stock: 25, category: 'textiles' },
    { name: 'Wool Throw Blanket', description: 'Heavyweight woven wool throw in a herringbone pattern.', price: 89.0, stock: 15, category: 'textiles' },
    { name: 'Forged Bottle Opener', description: 'Hand-forged carbon steel bottle opener with a brass pin.', price: 24.0, stock: 30, category: 'tools' },
    { name: 'Oak Handle Trowel', description: 'Garden trowel with a hand-fitted oak handle and carbon steel blade.', price: 32.0, stock: 18, category: 'tools' },
    { name: 'Amber Glass Pendant Lamp', description: 'Mouth-blown amber glass pendant with a brass fitting.', price: 145.0, stock: 10, category: 'lighting' },
    { name: 'Ribbed Ceramic Table Lamp', description: 'Ribbed ceramic base table lamp with a linen shade.', price: 98.0, stock: 12, category: 'lighting' },
  ];

  for (const p of productData) {
    const category = categories.find((c) => c.slug === p.category);
    const existing = await prisma.product.findFirst({ where: { name: p.name } });

    if (!existing) {
      await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          categoryId: category.id,
        },
      });
    }
  }

  console.log('Seed complete');
  console.log(`Admin login: admin@aterra.shop / Admin123!`);
  console.log(`Customer login: customer@aterra.shop / Customer123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
