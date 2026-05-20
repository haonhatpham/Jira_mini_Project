# Backend REST API

Simple Express REST API for the Jira mini project.

## Setup

```bash
npm install
npm run dev
```

Create `.env` from `.env.example` and update the PostgreSQL password:

```env
DATABASE_URL=postgres://postgres:your_password@localhost:5432/training_program
PORT=3001
```

Run the database scripts in pgAdmin Query Tool:

```txt
db/schema.sql
db/seed.sql
db/verify.sql
```

The API runs on:

```txt
http://localhost:3001
```

Swagger documentation:

```txt
http://localhost:3001/api/docs
http://localhost:3001/api/openapi.json
```

## Endpoints

```txt
GET  /api/products?page=1&limit=10&sort=price&order=desc&search=phone
GET  /api/products/:id
POST /api/products
PUT  /api/products/:id
DELETE /api/products/:id
GET  /api/users
```

## Product Schema

```json
{
  "name": "iPhone 16",
  "description": "Latest Apple smartphone with A-series chip.",
  "price": 1000,
  "category": "Phone",
  "tags": ["apple", "flagship"],
  "imageUrl": ""
}
```

Allowed categories:

```txt
Phone, Tablet, Accessory, Other
```

Unknown fields are rejected with `400 Validation failed`.

## Product API

### GET /api/products

Returns products from PostgreSQL with pagination, sorting, search, and filters.

Query parameters:

```txt
page      Positive integer. Default: 1
limit     Positive integer. Default: 10. Maximum effective value: 100
sort      One of: id, name, price, category, createdAt, updatedAt
order     asc or desc
search    Keyword matched against product name, description, category, or tags
category  One of: Phone, Tablet, Accessory, Other
minPrice  Number greater than or equal to 0
maxPrice  Number greater than or equal to 0
```

Example:

```http
GET /api/products?page=1&limit=10&sort=price&order=desc&search=phone&category=Phone&minPrice=100&maxPrice=1200
```

Status: `200 OK`

Response:

```json
{
  "data": [
    {
      "id": 1,
      "name": "iPhone 16 Pro",
      "description": "Premium Apple smartphone with powerful camera and fast performance.",
      "price": 1199,
      "category": "Phone",
      "tags": ["apple", "camera", "flagship", "ios"],
      "imageUrl": "https://picsum.photos/seed/iphone-16-pro/800/600",
      "createdAt": "2026-05-20T03:30:00.000Z",
      "updatedAt": "2026-05-20T03:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "sort": {
    "sort": "price",
    "order": "desc"
  },
  "filters": {
    "search": "phone",
    "category": "Phone",
    "minPrice": 100,
    "maxPrice": 1200
  }
}
```

If a client requests a huge limit such as `limit=1000000`, the API clamps it to
`100` before querying the database. This prevents one request from loading too
many rows into memory.

If PostgreSQL is unavailable, the API returns:

```txt
503 Service Unavailable
```

```json
{
  "message": "Database unavailable"
}
```

### GET /api/products/:id

Returns one product by id.

Status:

```txt
200 OK
400 Bad Request     Invalid id
404 Not Found       Product does not exist
```

### POST /api/products

Creates a product and returns the created resource.

Status:

```txt
201 Created
400 Bad Request     Validation failed
```

### PUT /api/products/:id

Replaces an existing product. The operation is idempotent: sending the same
request repeatedly leaves the product in the same state.

Status:

```txt
200 OK
400 Bad Request     Invalid id or validation failed
404 Not Found       Product does not exist
```

### DELETE /api/products/:id

Deletes a product. The operation is idempotent: deleting an already deleted
valid product id still returns `204` because the resource is absent after the
request.

Status:

```txt
204 No Content
400 Bad Request     Invalid id
```

## Validation Errors

If a required field is missing:

```http
PUT /api/products/1
Content-Type: application/json
```

```json
{
  "name": "Only name"
}
```

Response:

```json
{
  "message": "Validation failed",
  "errors": {
    "description": "Description is required.",
    "price": "Price is required.",
    "category": "Category is required."
  }
}
```

If an unknown field is sent:

```json
{
  "name": "iPhone 16",
  "description": "Latest Apple smartphone with A-series chip.",
  "price": 1000,
  "category": "Phone",
  "extra": "not allowed"
}
```

Response:

```json
{
  "message": "Validation failed",
  "errors": {
    "extra": "Field is not allowed."
  }
}
```

## Structure

```txt
backend/
  server.js               Express app setup and entry point
  config/db.js            PostgreSQL pool and legacy JSON helpers
  db/                     PostgreSQL schema, seed, and verify scripts
  controllers/            Request/response handlers
  services/               Business logic
  models/                 Data access logic
  routes/                 REST route definitions
  middleware/             Logging and error handlers
```

## Decisions

- Routes use REST resource names such as `/api/products` and
  `/api/products/:id`.
- Controllers stay thin and delegate business logic to services.
- Services validate inputs and throw meaningful HTTP errors.
- Product data is stored in PostgreSQL using parameterized queries.
- Product list queries are filtered, searched, sorted, and paginated in
  PostgreSQL instead of loading every row into JavaScript.
- Product sorting uses a whitelist of allowed columns, and query values are
  parameterized to avoid injection.
- Product list responses include pagination metadata and clamp `limit` to a
  maximum of `100`.
- PostgreSQL connection pooling is configured with `pg.Pool`.
- Error middleware returns clean JSON error messages without stack traces.
- Request logging middleware records method, URL, status code, and duration.
