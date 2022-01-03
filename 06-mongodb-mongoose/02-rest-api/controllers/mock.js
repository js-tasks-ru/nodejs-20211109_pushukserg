const Category = require('../models/Category');
const Product = require('../models/Product');

module.exports.mockData = async function mockData(ctx, next) {
  const cat1 = await Category.create({
    title: 'Category1',
    subcategories: [{
      title: 'Subcategory1',
    }],
  });

  await Product.create({
    title: 'Product1',
    description: 'Description1',
    price: 10,
    category: cat1.id,
    subcategory: cat1.subcategories[0].id,
    images: ['image1'],
  });

  const cat2 = await Category.create({
    title: 'Category2',
    subcategories: [{
      title: 'Subcategory2',
    }],
  });

  await Product.create({
    title: 'Product2',
    description: 'Description2',
    price: 10,
    category: cat2.id,
    subcategory: cat2.subcategories[0].id,
    images: ['image2'],
  });

  ctx.body = {};
};
