const productSchema = {
  type: "object",
  required: ["id", "name", "description", "price", "category", "tags", "imageUrl", "createdAt", "updatedAt"],
  properties: {
    id: {
      type: "integer",
      example: 1,
    },
    name: {
      type: "string",
      example: "iPhone 16",
    },
    description: {
      type: "string",
      example: "Latest Apple smartphone with A-series chip.",
    },
    price: {
      type: "number",
      example: 1000,
    },
    category: {
      type: "string",
      enum: ["Phone", "Tablet", "Accessory", "Other"],
      example: "Phone",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
      example: ["apple", "flagship"],
    },
    imageUrl: {
      type: "string",
      example: "",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      example: "2026-05-20T03:30:00.000Z",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      example: "2026-05-20T03:30:00.000Z",
    },
  },
};

const productListResponseSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        $ref: "#/components/schemas/Product",
      },
    },
    pagination: {
      type: "object",
      properties: {
        total: {
          type: "integer",
          example: 12,
        },
        page: {
          type: "integer",
          example: 1,
        },
        limit: {
          type: "integer",
          example: 10,
        },
        totalPages: {
          type: "integer",
          example: 2,
        },
        hasNextPage: {
          type: "boolean",
          example: true,
        },
        hasPrevPage: {
          type: "boolean",
          example: false,
        },
      },
    },
    sort: {
      type: "object",
      properties: {
        sort: {
          type: "string",
          example: "price",
        },
        order: {
          type: "string",
          enum: ["asc", "desc"],
          example: "desc",
        },
      },
    },
    filters: {
      type: "object",
      properties: {
        search: {
          type: "string",
          example: "phone",
        },
        category: {
          type: "string",
          example: "Phone",
        },
        minPrice: {
          type: "number",
          nullable: true,
          example: 100,
        },
        maxPrice: {
          type: "number",
          nullable: true,
          example: 1200,
        },
      },
    },
  },
};

const productInputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["name", "description", "price", "category"],
  properties: {
    name: productSchema.properties.name,
    description: productSchema.properties.description,
    price: productSchema.properties.price,
    category: productSchema.properties.category,
    tags: productSchema.properties.tags,
    imageUrl: productSchema.properties.imageUrl,
  },
};

const validationErrorSchema = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "Validation failed",
    },
    errors: {
      type: "object",
      additionalProperties: {
        type: "string",
      },
      example: {
        description: "Description is required.",
        price: "Price is required.",
        extra: "Field is not allowed.",
      },
    },
  },
};

const messageErrorSchema = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "Product not found",
    },
  },
};

const databaseUnavailableSchema = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "Database unavailable",
    },
  },
};

const databaseUnavailableResponse = {
  description: "Database unavailable",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/DatabaseUnavailable",
      },
    },
  },
};

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "Jira Mini Project API",
    version: "1.0.0",
    description: "D15-D18 REST API documentation for database-backed products.",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Products",
      description: "Product CRUD API",
    },
    {
      name: "Users",
      description: "User API",
    },
  ],
  paths: {
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Get products with pagination, sorting, search, and filters",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
            example: 1,
          },
          {
            name: "limit",
            in: "query",
            description: "Maximum effective limit is 100.",
            schema: {
              type: "integer",
              minimum: 1,
              default: 10,
              maximum: 100,
            },
            example: 10,
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["id", "name", "price", "category", "createdAt", "updatedAt"],
              default: "id",
            },
            example: "price",
          },
          {
            name: "order",
            in: "query",
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "asc",
            },
            example: "desc",
          },
          {
            name: "search",
            in: "query",
            schema: {
              type: "string",
            },
            example: "phone",
          },
          {
            name: "category",
            in: "query",
            schema: {
              type: "string",
              enum: ["Phone", "Tablet", "Accessory", "Other"],
            },
            example: "Phone",
          },
          {
            name: "minPrice",
            in: "query",
            schema: {
              type: "number",
              minimum: 0,
            },
            example: 100,
          },
          {
            name: "maxPrice",
            in: "query",
            schema: {
              type: "number",
              minimum: 0,
            },
            example: 1200,
          },
        ],
        responses: {
          200: {
            description: "Paginated product list",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProductListResponse",
                },
              },
            },
          },
          400: {
            description: "Invalid query parameter",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          503: databaseUnavailableResponse,
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create a product",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Product created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          400: {
            description: "Validation failed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          503: databaseUnavailableResponse,
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get one product by id",
        parameters: [
          {
            $ref: "#/components/parameters/ProductId",
          },
        ],
        responses: {
          200: {
            description: "Product found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          400: {
            description: "Invalid product id",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageError",
                },
              },
            },
          },
          404: {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageError",
                },
              },
            },
          },
          503: databaseUnavailableResponse,
        },
      },
      put: {
        tags: ["Products"],
        summary: "Replace a product",
        description: "Idempotent operation. Sending the same body repeatedly leaves the product in the same state.",
        parameters: [
          {
            $ref: "#/components/parameters/ProductId",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductInput",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Product replaced",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          400: {
            description: "Invalid id or validation failed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          404: {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageError",
                },
              },
            },
          },
          503: databaseUnavailableResponse,
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete a product",
        description: "Idempotent operation. Repeating the delete request keeps the product absent.",
        parameters: [
          {
            $ref: "#/components/parameters/ProductId",
          },
        ],
        responses: {
          204: {
            description: "Product deleted. No response body is returned.",
          },
          400: {
            description: "Invalid product id",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageError",
                },
              },
            },
          },
          503: databaseUnavailableResponse,
        },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        responses: {
          200: {
            description: "User list",
          },
        },
      },
    },
  },
  components: {
    parameters: {
      ProductId: {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
          minimum: 1,
        },
        example: 1,
      },
    },
    schemas: {
      Product: productSchema,
      ProductListResponse: productListResponseSchema,
      ProductInput: productInputSchema,
      DatabaseUnavailable: databaseUnavailableSchema,
      ValidationError: validationErrorSchema,
      MessageError: messageErrorSchema,
    },
  },
};
