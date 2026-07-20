const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');

let token;
let categoryId;
let productId;
let cartItemId;
const email = `cart-test-${Date.now()}@aterra.shop`;

beforeAll(async () => {
  await request(app).post('/api/auth/register').send({
    name: 'Cart Tester',
    email,
    password: 'password123',
  });

  const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'password123' });
  token = loginRes.body.token;

  const category = await prisma.category.create({
    data: { name: `Cart Category ${Date.now()}`, slug: `cart-category-${Date.now()}` },
  });
  categoryId = category.id;

  const product = await prisma.product.create({
    data: {
      name: 'Cart Test Product',
      description: 'Used for cart integration tests',
      price: 20,
      stock: 5,
      categoryId,
    },
  });
  productId = product.id;
});

afterAll(async () => {
  await prisma.product.deleteMany({ where: { id: productId } });
  await prisma.category.deleteMany({ where: { id: categoryId } });
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
});

describe('Cart API', () => {
  it('starts with an empty cart', async () => {
    const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  it('adds an item to the cart', async () => {
    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body.quantity).toBe(2);
    cartItemId = res.body.id;
  });

  it('reflects the correct total after adding an item', async () => {
    const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(40);
  });

  it('updates the quantity of a cart item', async () => {
    const res = await request(app)
      .put(`/api/cart/items/${cartItemId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 3 });

    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(3);
  });

  it('removes an item from the cart', async () => {
    const res = await request(app)
      .delete(`/api/cart/items/${cartItemId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('has an empty cart again after removal', async () => {
    const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);

    expect(res.body.items).toEqual([]);
  });
});
