const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  let products = [];
  const {query} = ctx.request.query;
  if (!query) {
    products = await Product.find({});
  } else {
    products = await Product.find({$text: {$search: query}});
  }
  ctx.body = {products: products.map(mapProduct)};
};
