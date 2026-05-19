const { products: initialProducts = [] } = require("../db.json");

let products = initialProducts.map((product) => ({ ...product }));

async function findAllProducts() {
  return products;
}

async function findProductById(id) {
  return products.find((product) => Number(product.id) === id) || null;
}

async function createProduct(productInput) {
  const nextId = getNextId(products);
  const product = { id: nextId, ...productInput };

  products.push(product);
  return product;
}

async function replaceProduct(id, productInput) {
  const index = products.findIndex((product) => Number(product.id) === id);

  if (index === -1) {
    return null;
  }

  const product = { id, ...productInput };
  products[index] = product;
  return product;
}

async function deleteProduct(id) {
  const initialLength = products.length;
  products = products.filter((product) => Number(product.id) !== id);
  return products.length < initialLength;
}

function getNextId(products) {
  return products.reduce((maxId, item) => Math.max(maxId, Number(item.id)), 0) + 1;
}

module.exports = {
  createProduct,
  deleteProduct,
  findAllProducts,
  findProductById,
  replaceProduct,
};
