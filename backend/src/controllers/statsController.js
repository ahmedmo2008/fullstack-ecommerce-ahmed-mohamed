const prisma = require('../config/prisma');
const ActivityLog = require('../models/ActivityLog');
const Review = require('../models/Review');

async function getStoreStats(req, res, next) {
  try {
    const [userCount, productCount, orderCount, revenueResult, topProducts, recentActivity, reviewCount] =
      await Promise.all([
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
        }),
        prisma.orderItem.groupBy({
          by: ['productId'],
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5,
        }),
        ActivityLog.find().sort({ createdAt: -1 }).limit(10),
        Review.countDocuments(),
      ]);

    const topProductIds = topProducts.map((p) => p.productId);
    const productDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
    });

    const topProductsWithNames = topProducts.map((tp) => {
      const product = productDetails.find((p) => p.id === tp.productId);
      return {
        productId: tp.productId,
        name: product ? product.name : 'Unknown',
        unitsSold: tp._sum.quantity,
      };
    });

    res.json({
      totalCustomers: userCount,
      totalProducts: productCount,
      totalOrders: orderCount,
      totalRevenue: Number(revenueResult._sum.totalAmount || 0),
      totalReviews: reviewCount,
      topProducts: topProductsWithNames,
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStoreStats };
