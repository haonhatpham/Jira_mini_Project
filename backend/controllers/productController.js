const productService = require("../services/productService");

async function getProducts(req, res, next) {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function replaceProduct(req, res, next) {
  try {
    const product = await productService.replaceProduct(req.params.id, req.body);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  replaceProduct,
};
