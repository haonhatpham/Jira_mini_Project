const productSchema = {
  type: "object",
  required: ["id", "name", "description", "price", "category", "tags", "imageUrl"],
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

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "Jira Mini Project API",
    version: "1.0.0",
    description: "D15 and D16 REST API documentation for products.",
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
        summary: "Get all products",
        responses: {
          200: {
            description: "Product list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
            },
          },
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
      ProductInput: productInputSchema,
      ValidationError: validationErrorSchema,
      MessageError: messageErrorSchema,
    },
  },
};
