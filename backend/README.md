# Backend REST API

Simple Express REST API for the Jira mini project.

## Setup

```bash
npm install
npm run dev
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
GET  /api/products
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

Returns all products.

Status: `200 OK`

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
  config/db.js            JSON database reader/writer
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
- Product data is stored in an in-memory array seeded from `db.json`.
- Error middleware returns clean JSON error messages without stack traces.
- Request logging middleware records method, URL, status code, and duration.
