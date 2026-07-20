const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');

let adminToken;
let categoryId;
let productId;
const adminEmail = `admin-test-${Date.now()}@aterra.shop`;

beforeAll(async () => {
  await request(app).post('/api/auth/register').send({
    name: 'Admin Test',
    email: adminEmail,
    password: 'password123',
  });

  await prisma.user.update({
    where: { email: adminEmail },
    data: { role: 'ADMIN' },
  });

  const loginRes = await request(app).post('/api/auth/login').send({
    email: adminEmail,
    password: 'password123',
  });

  adminToken = loginRes.body.token;

  const category = await prisma.category.create({
    data: { name: `Test Category ${Date.now()}`, slug: `test-category-${Date.now()}` },
  });
  categoryId = category.id;
});

afterAll(async () => {
  if (productId) await prisma.product.deleteMany({ where: { id: productId } });
  await prisma.category.deleteMany({ where: { id: categoryId } });
  await prisma.user.deleteMany({ where: { email: adminEmail } });
  await prisma.$disconnect();
});

describe('Product API', () => {
  it('rejects product creation from a non-admin or unauthenticated request', async () => {
    const res = await request(app).post('/api/products').send({
      name: 'Unauthorized Product',
      description: 'Should not be created',
      price: 10,
      categoryId,
    });

    expect(res.status).toBe(401);
  });

  it('creates a product as an admin', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('name', 'Test Vase')
      .field('description', 'A hand-thrown test vase')
      .field('price', '55.00')
      .field('stock', '10')
      .field('categoryId', categoryId);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Vase');
    productId = res.body.id;
  });

  it('lists products including the newly created one', async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it('retrieves a single product by id', async () => {
    const res = await request(app).get(`/api/products/${productId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(productId);
  });

  it('filters products by search term', async () => {
    const res = await request(app).get('/api/products?search=Vase');

    expect(res.status).toBe(200);
    expect(res.body.products.some((p) => p.id === productId)).toBe(true);
  });

  it('updates a product as admin', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .field('price', '60.00');

    expect(res.status).toBe(200);
    expect(Number(res.body.price)).toBe(60);
  });

  it('deletes a product as admin', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    productId = null;
  });
});
