const productModel = require("../models/productModel");

const ALLOWED_FIELDS = ["name", "price", "description", "category", "tags", "imageUrl"];
const ALLOWED_SORT_FIELDS = ["id", "name", "price", "category", "createdAt", "updatedAt"];
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const PRODUCT_CATEGORIES = ["Phone", "Tablet", "Accessory", "Other"];

async function getProducts(query = {}) {
  const options = validateProductQuery(query);
  const { data, total } = await productModel.findProducts(options);
  const totalPages = Math.ceil(total / options.limit);

  return {
    data,
    pagination: {
      total,
      page: options.page,
      limit: options.limit,
      totalPages,
      hasNextPage: options.page < totalPages,
      hasPrevPage: options.page > 1,
    },
    sort: {
      sort: options.sort,
      order: options.order,
    },
    filters: options.filters,
  };
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

function validateProductQuery(query) {
  const errors = {};
  const page = parsePositiveIntegerQuery(query.page, "page", DEFAULT_PAGE, errors);
  const requestedLimit = parsePositiveIntegerQuery(query.limit, "limit", DEFAULT_LIMIT, errors);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const sort = validateSortField(query.sort, errors);
  const order = validateSortOrder(query.order, errors);
  const filters = validateProductFilters(query, errors);

  if (Object.keys(errors).length > 0) {
    throwValidationError(errors);
  }

  return {
    page,
    limit,
    sort,
    order,
    filters,
  };
}

function parsePositiveIntegerQuery(value, field, defaultValue, errors) {
  if (value === undefined) {
    return defaultValue;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    errors[field] = `${field} must be a positive integer.`;
    return defaultValue;
  }

  return parsedValue;
}

function validateSortField(value, errors) {
  if (value === undefined || value === "") {
    return "id";
  }

  if (!ALLOWED_SORT_FIELDS.includes(value)) {
    errors.sort = `sort must be one of: ${ALLOWED_SORT_FIELDS.join(", ")}.`;
    return "id";
  }

  return value;
}

function validateSortOrder(value, errors) {
  if (value === undefined || value === "") {
    return "asc";
  }

  const normalizedOrder = String(value).toLowerCase();

  if (!["asc", "desc"].includes(normalizedOrder)) {
    errors.order = "order must be either asc or desc.";
    return "asc";
  }

  return normalizedOrder;
}

function validateProductFilters(query, errors) {
  const search = typeof query.search === "string" ? query.search.trim() : "";
  const category = validateCategoryFilter(query.category, errors);
  const minPrice = parseOptionalPriceFilter(query.minPrice, "minPrice", errors);
  const maxPrice = parseOptionalPriceFilter(query.maxPrice, "maxPrice", errors);

  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    errors.priceRange = "minPrice must be less than or equal to maxPrice.";
  }

  return {
    search,
    category,
    minPrice,
    maxPrice,
  };
}

function validateCategoryFilter(value, errors) {
  if (value === undefined || value === "") {
    return "";
  }

  if (typeof value !== "string" || !PRODUCT_CATEGORIES.includes(value)) {
    errors.category = `category must be one of: ${PRODUCT_CATEGORIES.join(", ")}.`;
    return "";
  }

  return value;
}

function parseOptionalPriceFilter(value, field, errors) {
  if (value === undefined || value === "") {
    return null;
  }

  const price = Number(value);

  if (!Number.isFinite(price) || price < 0) {
    errors[field] = `${field} must be a number greater than or equal to 0.`;
    return null;
  }

  return price;
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
