/**
 * File OpenAPI document: mo ta schema, endpoint va response cho Swagger UI.
 */
// Schema response product day du.
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

// Schema response danh sach product co pagination/sort/filter.
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

// Schema body tao/cap nhat product, tai su dung property tu productSchema.
const productRequestSchema = {
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

// Schema body dang ky user moi.
const registerInputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email", "username", "password", "confirmPassword"],
  properties: {
    email: {
      type: "string",
      format: "email",
      example: "new_customer@example.com",
    },
    username: {
      type: "string",
      minLength: 3,
      example: "new_customer",
    },
    password: {
      type: "string",
      minLength: 6,
      format: "password",
      example: "secret123",
    },
    confirmPassword: {
      type: "string",
      minLength: 6,
      format: "password",
      example: "secret123",
    },
  },
};

// Schema body dang nhap.
const loginInputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["username", "password"],
  properties: {
    username: {
      type: "string",
      example: "admin",
    },
    password: {
      type: "string",
      format: "password",
      example: "admin123",
    },
  },
};

// Schema response dang nhap gom JWT va role.
const loginResponseSchema = {
  type: "object",
  required: ["token", "expiresIn", "username", "role"],
  properties: {
    token: {
      type: "string",
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
    expiresIn: {
      type: "string",
      example: "1h",
    },
    username: {
      type: "string",
      example: "admin",
    },
    role: {
      type: "string",
      enum: ["admin", "customer"],
      example: "admin",
    },
  },
};

// Schema user public khong bao gom password hash.
const publicUserSchema = {
  type: "object",
  required: ["id", "username", "email", "role", "createdAt", "updatedAt"],
  properties: {
    id: {
      type: "integer",
      example: 3,
    },
    username: {
      type: "string",
      example: "new_customer",
    },
    email: {
      type: "string",
      format: "email",
      example: "new_customer@example.com",
    },
    role: {
      type: "string",
      enum: ["admin", "customer"],
      example: "customer",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      example: "2026-05-21T08:00:00.000Z",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      example: "2026-05-21T08:00:00.000Z",
    },
  },
};

// Schema option chung cho category/tag.
const optionSchema = {
  type: "object",
  required: ["id", "name"],
  properties: {
    id: {
      type: "integer",
      example: 1,
    },
    name: {
      type: "string",
      example: "Phone",
    },
  },
};

// Schema loi validation co details theo field.
const validationErrorSchema = {
  type: "object",
  required: ["status", "code", "message"],
  properties: {
    status: {
      type: "integer",
      example: 400,
    },
    code: {
      type: "string",
      example: "VALIDATION_ERROR",
    },
    message: {
      type: "string",
      example: "Validation failed",
    },
    details: {
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

// Schema loi chung chi co status/code/message.
const messageErrorSchema = {
  type: "object",
  required: ["status", "code", "message"],
  properties: {
    status: {
      type: "integer",
      example: 404,
    },
    code: {
      type: "string",
      example: "NOT_FOUND",
    },
    message: {
      type: "string",
      example: "Product not found",
    },
  },
};

const messageResponseSchema = {
  type: "object",
  required: ["message"],
  properties: {
    message: {
      type: "string",
      example: "Logout successful",
    },
  },
};

// Schema loi khi database khong san sang.
const databaseUnavailableSchema = {
  type: "object",
  required: ["status", "code", "message"],
  properties: {
    status: {
      type: "integer",
      example: 503,
    },
    code: {
      type: "string",
      example: "SERVICE_UNAVAILABLE",
    },
    message: {
      type: "string",
      example: "Database unavailable",
    },
  },
};

// Response 503 dung lai cho cac endpoint doc database.
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

// Response 409 khi request idempotent trung lap van dang xu ly.
const idempotencyInProgressResponse = {
  description: "An identical request with the same Idempotency-Key is still processing.",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/MessageError",
      },
    },
  },
};

// OpenAPI document duoc app expose tai /api/openapi.json va /api/docs.
export default {
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
      name: "Auth",
      description: "Authentication API",
    },
    {
      name: "Products",
      description: "Product CRUD API",
    },
    {
      name: "Categories",
      description: "Product category metadata API",
    },
    {
      name: "Tags",
      description: "Product tag metadata API",
    },
    {
      name: "Users",
      description: "User API",
    },
  ],
  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and receive a JWT",
        description: "Authenticates with bcrypt password comparison and returns a short-lived JWT. The JWT payload contains only user id and role.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginInput",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
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
          401: {
            description: "Invalid username or password",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a user",
        description: "Creates a customer account. The stored password is hashed with bcrypt and the response never includes the password.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PublicUser",
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
          409: {
            description: "Username or email already exists",
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
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout current user",
        description: "Stateless logout endpoint. The frontend clears its local JWT after this request.",
        responses: {
          200: {
            description: "Logout successful",
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
    "/api/categories": {
      get: {
        tags: ["Categories"],
        summary: "Get product categories",
        responses: {
          200: {
            description: "Category list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Category",
                  },
                },
              },
            },
          },
          503: databaseUnavailableResponse,
        },
      },
    },
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
        parameters: [
          {
            $ref: "#/components/parameters/IdempotencyKey",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductRequest",
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
            description: "Validation failed or missing idempotency key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          409: idempotencyInProgressResponse,
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
          {
            $ref: "#/components/parameters/IdempotencyKey",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductRequest",
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
            description: "Invalid id, validation failed, or missing idempotency key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          409: idempotencyInProgressResponse,
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
          {
            $ref: "#/components/parameters/IdempotencyKey",
          },
        ],
        responses: {
          204: {
            description: "Product deleted. No response body is returned.",
          },
          400: {
            description: "Invalid product id or missing idempotency key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageError",
                },
              },
            },
          },
          409: idempotencyInProgressResponse,
          503: databaseUnavailableResponse,
        },
      },
    },
    "/api/tags": {
      get: {
        tags: ["Tags"],
        summary: "Get product tags",
        responses: {
          200: {
            description: "Tag list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Tag",
                  },
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
      IdempotencyKey: {
        name: "Idempotency-Key",
        in: "header",
        required: true,
        description: "Unique key for safely retrying the same mutation request.",
        schema: {
          type: "string",
          minLength: 1,
        },
        example: "9f5d94b8-3b6b-4b4e-a83c-c528f86f0d4f",
      },
    },
    schemas: {
      Category: optionSchema,
      Product: productSchema,
      ProductListResponse: productListResponseSchema,
      ProductRequest: productRequestSchema,
      LoginInput: loginInputSchema,
      LoginResponse: loginResponseSchema,
      PublicUser: publicUserSchema,
      RegisterInput: registerInputSchema,
      Tag: optionSchema,
      DatabaseUnavailable: databaseUnavailableSchema,
      ValidationError: validationErrorSchema,
      MessageResponse: messageResponseSchema,
      MessageError: messageErrorSchema,
    },
  },
};
