const prisma = require('../config/prisma');
const slugify = require('../utils/slugify');

async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });

    res.json(categories);
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    const slug = slugify(name);

    const existing = await prisma.category.findFirst({ where: { OR: [{ name }, { slug }] } });

    if (existing) {
      return res.status(400).json({ message: 'A category with this name already exists' });
    }

    const category = await prisma.category.create({ data: { name, slug } });

    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const data = { name };
    if (name) data.slug = slugify(name);

    const category = await prisma.category.update({ where: { id }, data });

    res.json(category);
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    const productCount = await prisma.product.count({ where: { categoryId: id } });

    if (productCount > 0) {
      return res.status(400).json({ message: 'Cannot delete a category that still has products' });
    }

    await prisma.category.delete({ where: { id } });

    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
