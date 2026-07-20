import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:5000/api';

export const handlers = [
  http.get(`${API_URL}/products`, () => {
    return HttpResponse.json({
      products: [
        {
          id: 'prod-1',
          name: 'Stoneware Mug',
          description: 'A simple hand-thrown mug.',
          price: '18.00',
          stock: 5,
          imageUrl: null,
          category: { id: 'cat-1', name: 'Ceramics' },
        },
        {
          id: 'prod-2',
          name: 'Linen Napkin Set',
          description: 'Set of four stonewashed linen napkins.',
          price: '32.00',
          stock: 0,
          imageUrl: null,
          category: { id: 'cat-2', name: 'Textiles' },
        },
      ],
      pagination: { total: 2, page: 1, limit: 12, totalPages: 1 },
    });
  }),

  http.get(`${API_URL}/products/prod-1`, () => {
    return HttpResponse.json({
      id: 'prod-1',
      name: 'Stoneware Mug',
      description: 'A simple hand-thrown mug.',
      price: '18.00',
      stock: 5,
      imageUrl: null,
      categoryId: 'cat-1',
      category: { id: 'cat-1', name: 'Ceramics' },
    });
  }),

  http.get(`${API_URL}/reviews/prod-1`, () => {
    return HttpResponse.json({ reviews: [], averageRating: 0, count: 0 });
  }),

  http.get(`${API_URL}/categories`, () => {
    return HttpResponse.json([
      { id: 'cat-1', name: 'Ceramics', slug: 'ceramics', _count: { products: 1 } },
      { id: 'cat-2', name: 'Textiles', slug: 'textiles', _count: { products: 1 } },
    ]);
  }),

  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();

    if (body.email === 'customer@aterra.shop' && body.password === 'Customer123!') {
      return HttpResponse.json({
        token: 'mock-token',
        user: { id: 'user-1', name: 'Sample Customer', email: body.email, role: 'CUSTOMER' },
      });
    }

    return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }),

  http.get(`${API_URL}/cart`, () => {
    return HttpResponse.json({ id: 'cart-1', items: [], total: 0 });
  }),
];
