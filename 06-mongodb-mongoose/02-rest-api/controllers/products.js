const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();
  const productsBySubcategory = await Product.find({subcategory});

  ctx.body = {products: productsBySubcategory.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});

  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;

  if (!id) return next();

  try {
    new ObjectId(id);
  } catch (e) {
    ctx.status = 400;
    ctx.body = {error: 'Invalid id'};
    return next();
  }
  const product = await Product.findOne({_id: id});
  if (!product) {
    ctx.status = 404;
    ctx.body = {error: 'Product not found'};
    return next();
  }

  ctx.body = {product: mapProduct(product)};
};

