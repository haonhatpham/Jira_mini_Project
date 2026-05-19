const productModel = require("../models/productModel");

const ALLOWED_FIELDS = ["name", "price", "description", "category", "tags", "imageUrl"];
const PRODUCT_CATEGORIES = ["Phone", "Tablet", "Accessory", "Other"];

async function getProducts() {
  return productModel.findAllProducts();
}

async function getProductById(id) {
  const productId = validateProductId(id);
  const product = await productModel.findProductById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function createProduct(input) {
  const productInput = validateProductInput(input);
  return productModel.createProduct(productInput);
}

async function replaceProduct(id, input) {
  const productId = validateProductId(id);
  const productInput = validateProductInput(input);
  const product = await productModel.replaceProduct(productId, productInput);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function deleteProduct(id) {
  const productId = validateProductId(id);
  await productModel.deleteProduct(productId);
}

function validateProductId(id) {
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    const error = new Error("Invalid product id");
    error.statusCode = 400;
    throw error;
  }

  return productId;
}

function validateProductInput(input) {
  const errors = {};

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throwValidationError({ body: "Request body must be a JSON object." });
  }

  Object.keys(input).forEach((field) => {
    if (!ALLOWED_FIELDS.includes(field)) {
      errors[field] = "Field is not allowed.";
    }
  });

  const name = validateTextField(input, "name", {
    minLength: 2,
    requiredMessage: "Name is required.",
  }, errors);

  const description = validateTextField(input, "description", {
    minLength: 10,
    requiredMessage: "Description is required.",
  }, errors);

  const price = validatePrice(input.price, errors);
  const category = validateCategory(input.category, errors);
  const tags = validateTags(input.tags, errors);
  const imageUrl = validateImageUrl(input.imageUrl, errors);

  if (Object.keys(errors).length > 0) {
    throwValidationError(errors);
  }

  return {
    name,
    description,
    price,
    category,
    tags,
    imageUrl,
  };
}

function validateTextField(input, field, options, errors) {
  const value = input[field];

  if (value === undefined || value === null || value === "") {
    errors[field] = options.requiredMessage;
    return "";
  }

  if (typeof value !== "string") {
    errors[field] = `${field} must be a string.`;
    return "";
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length < options.minLength) {
    errors[field] = `${field} must be at least ${options.minLength} characters.`;
  }

  return trimmedValue;
}

function validatePrice(value, errors) {
  if (value === undefined || value === null || value === "") {
    errors.price = "Price is required.";
    return 0;
  }

  const price = Number(value);

  if (!Number.isFinite(price) || price < 0) {
    errors.price = "Price must be a number greater than or equal to 0.";
    return 0;
  }

  return price;
}

function validateCategory(value, errors) {
  if (value === undefined || value === null || value === "") {
    errors.category = "Category is required.";
    return "";
  }

  if (typeof value !== "string" || !PRODUCT_CATEGORIES.includes(value)) {
    errors.category = `Category must be one of: ${PRODUCT_CATEGORIES.join(", ")}.`;
    return "";
  }

  return value;
}

function validateTags(value, errors) {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    errors.tags = "Tags must be an array of strings.";
    return [];
  }

  const invalidTag = value.find((tag) => typeof tag !== "string");

  if (invalidTag !== undefined) {
    errors.tags = "Tags must be an array of strings.";
    return [];
  }

  return value.map((tag) => tag.trim()).filter(Boolean);
}

function validateImageUrl(value, errors) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (typeof value !== "string") {
    errors.imageUrl = "imageUrl must be a string.";
    return "";
  }

  return value.trim();
}

function throwValidationError(errors) {
  const error = new Error("Validation failed");
  error.statusCode = 400;
  error.errors = errors;
  throw error;
}

module.exports = {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  replaceProduct,
};
