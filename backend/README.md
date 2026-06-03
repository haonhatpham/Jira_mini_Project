# Backend REST API - Jira Mini Project

Backend là REST API viết bằng TypeScript, Express và PostgreSQL cho Jira Mini Project. Phần này xử lý các nhóm chức năng chính: xác thực người dùng, phân quyền admin/customer, quản lý sản phẩm, lấy danh mục, lấy tag và lấy danh sách người dùng.

## Kiến Trúc Tổng Quan

Luồng xử lý request:

```txt
Client request
  -> src/server.ts
  -> routes/
  -> middleware/ nếu route cần validate request, xác thực hoặc phân quyền
  -> controllers/
  -> services/
  -> models/
  -> Prisma Client
  -> PostgreSQL
  -> JSON response
```

Vai trò từng tầng:

- `src/server.ts`: khởi tạo HTTP server; `src/app.ts` cấu hình Express, Swagger/OpenAPI và mount route.
- `routes/`: khai báo URL, HTTP method và middleware cần dùng cho từng endpoint.
- `middleware/`: xử lý logic cắt ngang như validate request, log request, JWT authentication, role authorization, 404 và error response.
- `controllers/`: nhận `req`, gọi service, set HTTP status và trả JSON.
- `services/`: chứa business logic, xử lý dữ liệu đã validate và tạo lỗi HTTP có ý nghĩa.
- `models/`: truy cập PostgreSQL bằng Prisma Client.
- `pagination/`: chứa helper dùng chung cho phân trang, sort và page result.
- `exceptions/`: định nghĩa `HttpException`, các exception cụ thể và middleware xử lý lỗi tập trung.
- `types/`: gom TypeScript type và helper dùng chung.
- `docs/`: khai báo tài liệu OpenAPI/Swagger.
- `config/`: cấu hình Prisma/database và authentication.
- `constants/`: chứa hằng số dùng chung như HTTP status code.

## Cài Đặt Và Chạy

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Tạo file `.env` từ `.env.example`:

```env
DATABASE_URL=postgres://postgres:your_password@localhost:5432/training_program
PORT=3001
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=1h
PASSWORD_SALT_ROUNDS=10
```

API mặc định chạy tại:

```txt
http://localhost:3001
```

Swagger/OpenAPI:

```txt
http://localhost:3001/api/docs
http://localhost:3001/api/openapi.json
```

## Scripts

```bash
npm run dev              # Chạy src/server.ts bằng tsx watch
npm run typecheck        # Kiểm tra TypeScript không emit file
npm run build            # Biên dịch TypeScript vào dist/
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Chạy Prisma migration ở môi trường dev
npm run prisma:seed      # Seed dữ liệu mẫu bằng TypeScript
npm start                # Chạy dist/src/server.js
```

## Biến Môi Trường

| Biến | Chức năng |
| --- | --- |
| `DATABASE_URL` | Connection string kết nối PostgreSQL, được dùng trong `config/prisma.ts` và `prisma.config.ts`. |
| `PORT` | Port Express listen. Nếu không khai báo thì dùng `3001`. |
| `JWT_SECRET` | Secret dùng để ký và verify JWT. Runtime bắt buộc phải có biến này. |
| `JWT_EXPIRES_IN` | Thời gian hết hạn token. Mặc định là `1h`. |
| `PASSWORD_SALT_ROUNDS` | Số bcrypt salt rounds khi hash password. Phải là số nguyên >= 10. |
| `NODE_ENV` | Ảnh hưởng CORS và error response. Nếu không phải `production`, server bật CORS cho frontend localhost. |

Lưu ý: `.env` là file cấu hình local có thể chứa secret, không nên commit lên Git.

## Endpoint Chính

| Method | Path | Quyền truy cập | Chức năng |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | Public | Đăng nhập và nhận JWT. |
| `POST` | `/api/auth/login` | Public | Alias của login API. |
| `POST` | `/auth/register` | Public | Đăng ký tài khoản customer. |
| `POST` | `/api/auth/register` | Public | Alias của register API. |
| `POST` | `/auth/logout` | Public | Đăng xuất stateless, frontend xóa JWT localStorage. |
| `POST` | `/api/auth/logout` | Public | Alias của logout API. |
| `GET` | `/api/categories` | Public | Lấy danh sách category. |
| `GET` | `/api/tags` | Public | Lấy danh sách tag. |
| `GET` | `/api/products` | Public | Lấy danh sách product có pagination, sorting, search và filter. |
| `GET` | `/api/products/:id` | Public | Lấy chi tiết product theo id. |
| `POST` | `/api/products` | Admin | Tạo product mới. |
| `PUT` | `/api/products/:id` | Admin | Thay thế toàn bộ product. |
| `DELETE` | `/api/products/:id` | Admin | Xóa product theo id. |
| `GET` | `/api/users` | Admin | Lấy danh sách user public. |

Route cần admin phải gửi header:

```http
Authorization: Bearer <jwt>
```

## Cấu Trúc Backend

```txt
backend/
  dist/
  generated/
  node_modules/
  prisma/
  src/
    app.ts
    server.ts
    cache/
    config/
    constants/
    controllers/
    docs/
    exceptions/
    idempotency/
    logger/
    middleware/
    models/
    pagination/
    routes/
    schemas/
    services/
    types/
    utils/
  .env
  .env.example
  package-lock.json
  package.json
  README.md
  prisma.config.ts
  tsconfig.json
```

## File Source Chính

### `src/server.ts`

File entry point của backend.

Chức năng:

- Import `dotenv/config` để đọc biến môi trường từ `.env`.
- Tạo Express app.
- Cấu hình CORS trong môi trường không phải production:
  - Cho phép `http://localhost:3000`.
  - Cho phép `http://localhost:5173`.
  - Cho phép các method `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
  - Cho phép header `Content-Type`, `Authorization`.
- Bật `express.json()` để đọc JSON request body.
- Gắn `requestLogger` để log method, URL, status code và thời gian xử lý.
- Mở endpoint `/api/openapi.json` để trả OpenAPI document.
- Mở Swagger UI tại `/api/docs`.
- Mount các route:
  - `/auth`
  - `/api/auth`
  - `/api/categories`
  - `/api/products`
  - `/api/tags`
  - `/api/users`
- Gắn `notFoundHandler` cho route không tồn tại.
- Gắn `exceptionMiddleware` cuối cùng để format lỗi JSON.
- Listen trên `PORT` hoặc `3001`.

### `package.json`

Khai báo metadata, script, dependency và devDependency của backend.

Điểm quan trọng:

- `"type": "module"`: backend dùng ES Modules.
- `"main": "dist/src/server.js"`: file JavaScript chạy sau khi build.
- `scripts.dev`: chạy server bằng `tsx watch`.
- `scripts.build`: biên dịch TypeScript bằng `tsc`.
- `scripts.start`: chạy app đã build ở `dist/src/server.js`.
- `scripts.typecheck`: kiểm tra TypeScript không emit file.
- `express`, `@prisma/client`, `@prisma/adapter-pg`, `dotenv`, `cors`: nền tảng HTTP, database và config.
- `jsonwebtoken`, `bcryptjs`: JWT và password hashing.
- `zod`: validate schema.
- `swagger-ui-express`: hiển thị Swagger UI.

### `package-lock.json`

File lock dependency của npm.

Chức năng:

- Ghi lại chính xác version dependency và transitive dependency.
- Giúp `npm install` tạo môi trường giống nhau trên các máy.
- Nên commit file này để tránh lệch version package.

### `tsconfig.json`

Cấu hình TypeScript compiler cho backend.

Điểm quan trọng:

- `target: "ES2022"`: biên dịch theo JavaScript ES2022.
- `module: "NodeNext"` và `moduleResolution: "NodeNext"`: phù hợp Node.js ES Modules.
- `strict: true`: bật strict type checking.
- `noImplicitAny`, `noImplicitReturns`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`: tăng độ chặt của type safety.
- `outDir: "dist"`: output build nằm trong `dist/`.
- `rootDir: "."`: source root là thư mục backend.
- `include`: include source trong `src/**/*.ts` và `src/**/*.d.ts`.
- `exclude`: bỏ qua `dist` và `node_modules`.

### `.env`

File cấu hình môi trường local.

Chức năng:

- Chứa giá trị thật của `DATABASE_URL`, `JWT_SECRET`, port và các config runtime.
- Được đọc khi app import `dotenv/config`.
- Có thể chứa secret nên không nên đưa vào repository public.

### `.env.example`

File mẫu cho `.env`.

Chức năng:

- Cho người mới clone project biết backend cần những biến môi trường nào.
- Chứa placeholder an toàn như `your_password` và `change_this_to_a_long_random_secret`.
- Nên cập nhật file này khi backend cần thêm biến môi trường mới.

### `README.md`

File tài liệu backend.

Chức năng:

- Giải thích cách chạy backend.
- Mô tả kiến trúc, endpoint, biến môi trường.
- Ghi chú chức năng từng thư mục và từng file quan trọng.

## Thư Mục `config/`

Chứa các file cấu hình hạ tầng và bảo mật.

### `config/env.ts`

Đọc và validate biến môi trường runtime ở một nơi duy nhất.

Chức năng:

- Import `dotenv/config` để đọc `.env`.
- Export `env` object và từng biến riêng như `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PASSWORD_SALT_ROUNDS`, `NODE_ENV`, `PORT`.
- Validate `NODE_ENV` chỉ nhận `development`, `test`, `production`.
- Validate `PORT` là số nguyên trong khoảng `1..65535`.
- Validate `PASSWORD_SALT_ROUNDS` là số nguyên và tối thiểu `10`.
- Throw lỗi sớm khi thiếu biến bắt buộc như `DATABASE_URL` hoặc `JWT_SECRET`.

### `config/prisma.ts`

Quản lý Prisma Client dùng chung cho backend.

Chức năng:

- Đọc `DATABASE_URL` từ biến môi trường.
- Tạo `PrismaPg` adapter cho PostgreSQL.
- Tạo singleton `prisma` để model dùng chung.
- Export `withPrismaErrorHandling()` để chuẩn hóa lỗi kết nối/cấu hình database thành HTTP 503 `Database unavailable`.
- Nhận diện các lỗi Prisma/PostgreSQL phổ biến như `P1000`, `P1001`, `P1002`, `P1003`, `P1017`, `ECONNREFUSED`, `ENOTFOUND`, `ETIMEDOUT`, `EAI_AGAIN`.

### `config/auth.ts`

Quản lý cấu hình authentication.

Chức năng:

- Export `JWT_EXPIRES_IN`, mặc định `1h`.
- Export `PASSWORD_SALT_ROUNDS`, mặc định `10`.
- Re-export các biến auth đã được validate từ `config/env.ts`.
- Export `getJwtSecret()` để service auth lấy JWT secret đã validate.

## Thư Mục `constants/`

Chứa các hằng số dùng chung trong backend.

### `constants/httpStatus.ts`

Tập trung HTTP status code để tránh hard-code số như `200`, `201`, `400`, `500` trong runtime code.

Chức năng:

- Export `HttpStatus` với các status phổ biến như `OK`, `CREATED`, `NO_CONTENT`, `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INTERNAL`, `SERVICE_UNAVAILABLE`.
- Export `HttpStatusType` để type cho status code hợp lệ.
- Được dùng trong controller, middleware, service, config và HTTP error helper.

## Thư Mục `routes/`

Chứa Express router. Mỗi file route khai báo URL, HTTP method, middleware cần thiết và chuyển xử lý sang controller.

### `routes/authRoutes.ts`

Route xác thực.

- `POST /login` gọi `authController.login`.
- `POST /register` gọi `authController.register`.
- `POST /logout` gọi `authController.logout`.
- File này được mount ở cả `/auth` và `/api/auth`, nên auth endpoint có thể gọi bằng cả hai prefix này.

### `routes/categoryRoutes.ts`

Route category.

- `GET /` gọi `categoryController.getCategories`.
- Khi mount trong `src/app.ts`, endpoint đầy đủ là `GET /api/categories`.

### `routes/productRoutes.ts`

Route product.

- `GET /` validate query bằng `productListRequestSchema`, rồi gọi `productController.getProducts`.
- `GET /:id` validate params bằng `productIdRequestSchema`, rồi gọi `productController.getProductById`.
- `POST /` dùng `authenticateToken`, `requireRole("admin")`, validate body bằng `createProductRequestSchema`, rồi gọi `productController.createProduct`.
- `PUT /:id` dùng `authenticateToken`, `requireRole("admin")`, validate params/body bằng `replaceProductRequestSchema`, rồi gọi `productController.replaceProduct`.
- `DELETE /:id` dùng `authenticateToken`, `requireRole("admin")`, validate params bằng `productIdRequestSchema`, rồi gọi `productController.deleteProduct`.

Ý nghĩa:

- Đọc product là public.
- Tạo, sửa, xóa product chỉ dành cho admin.

### `routes/tagRoutes.ts`

Route tag.

- `GET /` gọi `tagController.getTags`.
- Khi mount trong `src/app.ts`, endpoint đầy đủ là `GET /api/tags`.

### `routes/userRoutes.ts`

Route user.

- `GET /` dùng `authenticateToken`, `requireRole("admin")`, rồi gọi `userController.getUsers`.
- Khi mount trong `src/app.ts`, endpoint đầy đủ là `GET /api/users`.
- Chỉ admin mới lấy được danh sách user.

## Thư Mục `controllers/`

Controller là lớp mỏng giữa route và service. Controller chỉ lấy input từ request, gọi service, set status code và trả response. Business logic nằm ở service.

### `controllers/authController.ts`

Xử lý HTTP cho auth.

- `register(req, res, next)`:
  - Nhận `req.body` đã validate bởi `registerRequestSchema`.
  - Gọi `authService.register(input)`.
  - Thành công trả `201 Created`.
  - Response là `PublicUser`, không có password.
- `login(req, res, next)`:
  - Nhận `req.body` đã validate bởi `loginRequestSchema`.
  - Gọi `authService.login(input)`.
  - Thành công trả `200 OK`.
  - Response gồm token, expiresIn, username và role.
- `logout(req, res, next)`:
  - Gọi `authService.logout()`.
  - Thành công trả `200 OK`.
  - Response gồm message; frontend chịu trách nhiệm xóa JWT trong localStorage.
- Lỗi được đưa vào `next(err)` để `exceptionMiddleware` xử lý.

### `controllers/categoryController.ts`

Xử lý lấy danh sách category.

- `getCategories()` gọi `categoryService.getCategories()`.
- Thành công trả `200 OK` với `NamedEntity[]`.

### `controllers/productController.ts`

Xử lý HTTP cho product.

- `getProducts()` truyền `req.query` đã validate/coerce sang `productService.getProducts`.
- `getProductById()` lấy `req.params.id` đã validate, đổi sang number và trả product theo id.
- `createProduct()` lấy `req.body` đã validate, tạo product mới và trả `201 Created`.
- `replaceProduct()` lấy `req.params.id` cùng `req.body` đã validate, thay thế product và trả `200 OK`.
- `deleteProduct()` lấy `req.params.id` đã validate, xóa product và trả `204 No Content`.

### `controllers/tagController.ts`

Xử lý lấy danh sách tag.

- `getTags()` gọi `tagService.getTags()`.
- Thành công trả `200 OK` với `NamedEntity[]`.

### `controllers/userController.ts`

Xử lý HTTP cho user.

- `getUsers()` gọi `userService.getUsers()`.
- Thành công trả `200 OK` với `PublicUser[]`.
- Password hash không được trả về vì service đã map sang public user.

## Thư Mục `services/`

Service chứa business logic, xử lý quy tắc nghiệp vụ, tạo HTTP error và gọi model. Request shape validation nằm ở middleware/schema trước khi request vào controller.

### `services/authService.ts`

Xử lý đăng ký, đăng nhập, hash password và tạo JWT.

Thành phần chính:

- `DEFAULT_ROLE = "customer"`: user mới đăng ký mặc định là customer.
- `createConflictError()`: tạo `ConflictException` khi username đã tồn tại.
- `createUnauthorizedError()`: tạo `UnauthorizedException` khi login sai.
- `createAccessToken(user)`:
  - Gọi `signAccessToken()` trong `utils/jwt.ts`.
  - Payload chỉ gồm `sub` là user id dạng string và `role` là role của user.
- `createAuthResponse(user)` trả `token`, `expiresIn`, `username`, `role`.
- `register(input)`:
  - Nhận `RegisterCredentials` đã được middleware validate.
  - Kiểm tra username đã tồn tại chưa.
  - Hash password bằng bcrypt.
  - Tạo user mới qua `userModel.createUser`.
  - Trả `PublicUser`.
- `login(input)`:
  - Nhận `LoginCredentials` đã được middleware validate.
  - Tìm user theo username.
  - Compare password bằng bcrypt.
  - Trả JWT response.
- `logout()`:
  - Trả message thành công cho stateless JWT logout.
  - Không xóa session ở database vì project không dùng session/refresh token.

### `services/categoryService.ts`

Service cho category.

- `getCategories()` gọi `categoryModel.findAllCategories()`.
- Trả danh sách category dạng `NamedEntity[]`.

### `services/productService.ts`

Service xử lý business logic cho product. File này nhận `ProductQueryOptions`, `ProductRequest` và `productId` đã được validate từ route middleware.

Hàm public:

- `getProducts(query)`:
  - Gọi `productModel.findProducts(options)`.
  - Dùng `Page` để tính `totalPages`, `hasNextPage`, `hasPrevPage`.
  - Trả response gồm `data`, `pagination`, `sort`, `filters`.
- `getProductById(id)`:
  - Gọi `productModel.findProductById`.
  - Nếu không có product, throw 404 `Product not found`.
- `createProduct(input)`:
  - Gọi `productModel.createProduct`.
- `replaceProduct(id, input)`:
  - Gọi `productModel.replaceProduct`.
  - Nếu model trả `null`, throw 404.
- `deleteProduct(id)`:
  - Gọi `productModel.deleteProduct`.
  - Delete có tính idempotent: id hợp lệ nhưng product không tồn tại vẫn không lỗi.

Validation query hiện nằm ở `schemas/productRequestSchemas.ts`:

- `page`: positive integer, mặc định `1`.
- `limit`: positive integer, mặc định `10`, bị clamp tối đa `100`.
- `sort`: string không rỗng, sau đó model map qua whitelist `getSortColumn`.
- `order`: `asc` hoặc `desc`, không phân biệt hoa thường.
- `search`: string, được trim.
- `category`: string không rỗng; category có tồn tại hay không được kiểm tra với database.
- `minPrice`, `maxPrice`: number >= 0.
- `minPrice <= maxPrice`.

Validation body hiện nằm ở `schemas/productRequestSchemas.ts`:

- Dùng Zod schema `ProductRequestSchema` trong `schemas/productSchemas.ts`.
- Reject field lạ.
- Route middleware reject field lạ và trả lỗi `Validation failed`.

## Thư Mục `exceptions/`

Chứa hệ thống exception chuẩn của backend.

### `exceptions/httpException.ts`

Định nghĩa base class `HttpException`.

- Có `status` là HTTP status code.
- Có `code` là mã lỗi dạng string, ví dụ `VALIDATION_ERROR`, `NOT_FOUND`.
- Có `expose` để quyết định có trả message thật trong production không.
- Kế thừa `Error` và giữ stack trace đúng prototype.

### `exceptions/commonExceptions.ts`

Định nghĩa các exception cụ thể:

- `BadRequestException`
- `UnauthorizedException`
- `ForbiddenException`
- `NotFoundException`
- `ConflictException`
- `ValidationException`
- `TooManyRequestsException`
- `ServiceUnavailableException`
- `InternalServerErrorException`

### `exceptions/exceptionMiddleware.ts`

Middleware xử lý lỗi tập trung.

- Nếu lỗi là `HttpException`, trả response theo format `status`, `code`, `message`.
- Nếu là `ValidationException`, trả thêm `details`.
- Nếu là lỗi không xác định, development trả thêm stack, production trả response generic.
- `notFoundHandler` tạo `NotFoundException` cho route không tồn tại.

### `exceptions/index.ts`

Barrel file export toàn bộ exception và middleware để import gọn.

### `services/tagService.ts`

Service cho tag.

- `getTags()` gọi `tagModel.findAllTags()`.
- Trả danh sách tag dạng `NamedEntity[]`.

### `services/userService.ts`

Service cho user.

- `getUsers()` gọi `userModel.findAllUsers()`.
- Map từng `UserRecord` sang `PublicUser` bằng `toPublicUser`.
- Đảm bảo response không lộ `password_hash`.

## Thư Mục `models/`

Model là lớp truy cập database. Hiện tại backend dùng Prisma Client, nên model gọi `prisma.user`, `prisma.product`, `prisma.category`, `prisma.tag` thay vì tự viết SQL runtime.

Database schema được định nghĩa trong `prisma/schema.prisma` với các bảng:

- `users`
- `categories`
- `products`
- `tags`
- `product_tags`

### `models/categoryModel.ts`

Truy vấn category.

- `findAllCategories()` dùng `prisma.category.findMany()`.
- Kết quả được sort theo `name ASC`.
- Trả `NamedEntity[]`.

### `models/tagModel.ts`

Truy vấn tag.

- `findAllTags()` dùng `prisma.tag.findMany()`.
- Kết quả được sort theo `name ASC`.
- Trả `NamedEntity[]`.

### `models/userModel.ts`

Truy vấn user.

- `findAllUsers()` lấy toàn bộ user, sort theo `id ASC`.
- `findUserByUsername(username)` tìm username không phân biệt hoa thường bằng Prisma filter `mode: "insensitive"`.
- `findUserById(id)` tìm user theo id.
- `createUser(userInput)` tạo user mới, lưu password hash vào field Prisma `passwordHash`.
- `mapUserRecord(user)` đổi record Prisma sang `UserRecord` nội bộ và kiểm tra `role` có hợp lệ không.

### `models/productModel.ts`

Truy vấn product, category và tag relation. Đây là model phức tạp nhất.

Thành phần chính:

- `productInclude`: cấu hình Prisma include để lấy category và tags kèm product.
- `ProductWithRelations`: type Prisma suy ra từ `productInclude`.

Hàm public:

- `findProducts(options)` lấy danh sách product theo filter/search/sort/pagination và trả `{ data, total }`.
- `findProductById(id)` lấy product theo id, trả `Product | null`.
- `createProduct(productRequest)` tạo product trong Prisma transaction, tìm category, tạo product, gắn tags rồi trả response đầy đủ.
- `replaceProduct(id, productRequest)` kiểm tra product tồn tại, update product và thay tag relations trong transaction.
- `deleteProduct(id)` dùng `deleteMany` để xóa idempotent, product không tồn tại cũng không throw.

Hàm nội bộ:

- `findProductsUnchecked(options)` chạy `findMany` và `count` trong cùng Prisma transaction.
- `findCategoryId(client, categoryName)` tìm category theo name, nếu không có thì throw 400 `Category not found`.
- `replaceProductTags(client, productId, tags)` xóa relation cũ, upsert tag theo name, rồi upsert relation trong `product_tags`.
- `mapProductRecord(product)` đổi record Prisma sang response `Product`, convert `Decimal` sang number và `Date` sang ISO string.
- `buildProductWhere(filters)` tạo Prisma `where` cho search theo name, description, category, tag và filter giá/category.
- `getProductOrderBy(sort, direction)` map sort field API sang Prisma `orderBy` whitelist.

## Thư Mục `middleware/`

Chứa middleware Express dùng chung.

### `middleware/requestLogger.ts`

Log method, URL, status code và thời gian xử lý sau khi response kết thúc.

### `middleware/authenticateToken.ts`

Xác thực JWT từ `Authorization: Bearer <token>`.

- Đọc token từ header.
- Gọi `verifyAccessToken()` trong `utils/jwt.ts`.
- Nếu token thiếu/sai/hết hạn, chuyển `UnauthorizedException`.
- Nếu hợp lệ, gắn `req.user = { id, role }`.

### `middleware/requireRole.ts`

Middleware authorization cho route cần role cụ thể.

- `requireRole("admin")` chỉ cho admin đi tiếp.
- Nếu chưa có `req.user`, trả 401.
- Nếu role không được phép, trả 403.

### `middleware/validateRequest.ts`

Middleware validate request bằng Zod trước khi vào controller.

- Nhận schema dạng `{ body, params, query }`.
- Parse `req.body`, `req.params`, `req.query`.
- Ghi lại dữ liệu đã parse vào request để controller/service nhận dữ liệu sạch.
- Nếu Zod báo lỗi, chuyển thành `ValidationException`.
- Format lỗi thành object field -> message và đưa vào `details`.

Error response chuẩn của `exceptionMiddleware`:

```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "field": "Error message"
  }
}
```

## Thư Mục `docs/`

Chứa tài liệu API dưới dạng code.

### `docs/openapi.ts`

Export OpenAPI document cho Swagger UI và endpoint JSON.

Nội dung chính:

- Khai báo OpenAPI version `3.0.3`.
- Info:
  - Title: `Jira Mini Project API`.
  - Version: `1.0.0`.
  - Description cho REST API database-backed products.
- Server local: `http://localhost:3001`.
- Tags:
  - `Auth`
  - `Products`
  - `Categories`
  - `Tags`
  - `Users`
- Paths:
  - `/api/auth/login`
  - `/api/auth/register`
  - `/api/categories`
  - `/api/products`
  - `/api/products/{id}`
  - `/api/tags`
  - `/api/users`
- Components:
  - Parameter `ProductId`.
  - Schemas `Category`, `Product`, `ProductListResponse`, `ProductRequest`, `LoginInput`, `LoginResponse`, `PublicUser`, `RegisterInput`, `Tag`, `DatabaseUnavailable`, `ValidationError`, `MessageResponse`, `MessageError`.

File này được dùng tại:

- `GET /api/openapi.json`
- Swagger UI `/api/docs`

## Thư Mục `schemas/`

Chứa Zod schema dành cho request/input validation. Response không dùng Zod runtime schema; response shape được mô tả bằng TypeScript type trong `types/` và được tạo qua mapper/service.

### `schemas/authSchemas.ts`

Chứa schema validate auth request.

- `usernameSchema`, `loginSchema`, `registerSchema`.
- `loginRequestSchema`, `registerRequestSchema`.
- `userRoleSchema`.
- `UserRole`, `LoginCredentials`, `RegisterCredentials`.
- `isUserRole(value)`.

### `schemas/productSchemas.ts`

Chứa schema validate product request/filter và type input suy ra từ schema.

- Category, request, filter và list query schemas.
- `ProductCategory`, `ProductRequest`, `ProductFilters`, `ProductQueryOptions`.

### `schemas/productRequestSchemas.ts`

Schema validate request của product API.

Chức năng:

- `productListRequestSchema`:
  - Validate và parse `req.query` cho `GET /api/products`.
  - Coerce `page`, `limit`, `minPrice`, `maxPrice` từ string query sang number.
  - Mặc định `page = 1`, `limit = 10`, `sort = "id"`, `order = "asc"`.
  - Clamp `limit` tối đa `100`.
  - Chuẩn hóa `order` về lowercase.
  - Transform query phẳng thành `ProductQueryOptions` có `pageable` và `filters`.
- `productIdRequestSchema`:
  - Validate `req.params.id` là positive integer string.
- `createProductRequestSchema`:
  - Validate `req.body` bằng `ProductRequestSchema`.
- `replaceProductRequestSchema`:
  - Validate cả `req.params.id` và `req.body`.

## Thư Mục `types/`

Chứa TypeScript type/helper không phải Zod request schema. Response type được đặt ở đây và response object được tạo bởi mapper/service.

### `types/auth.ts`

Chứa response/request-adjacent type cho auth.

- `LoginResponse`.
- `LogoutResponse`.
- `AuthenticatedUser`.

### `types/option.ts`

Chứa response type dạng `id/name` dùng cho category/tag options.

- `NamedEntity`.
- `CategoryOption`.
- `TagOption`.

### `types/product.ts`

Chứa response type cho product.

- `Product`.
- `ProductPagination`.
- `ProductListResponse`.
- `ProductListResult`.

### `types/user.ts`

Chứa type cho user.

Chức năng:

- Định nghĩa `PublicUser` là response user an toàn, không có password.
- Định nghĩa `UserRecord` là shape user nội bộ lấy từ database, có password hash.
- Định nghĩa `CreateUserInput` cho thao tác tạo user.
- Export `toPublicUser(user)` để loại bỏ password và format date sang ISO string.

### `types/express.d.ts`

Mở rộng type Express global.

Chức năng:

- Thêm property `user?: AuthenticatedUser` vào `Express.Request`.
- Cho phép middleware `authenticateToken` gắn `req.user`.
- Giúp middleware/controller sau đó đọc `req.user` mà TypeScript không báo lỗi.

## Thư Mục `pagination/`

Chứa helper phân trang và sort dùng chung.

### `pagination/sort.ts`

- Định nghĩa `Direction`, `Order` và class `Sort`.
- Hỗ trợ tạo sort bằng `Sort.by(...)` hoặc parse chuỗi dạng `-name,price`.

### `pagination/pageable.ts`

- Định nghĩa class `Pageable` chứa `page`, `limit`, `sort`.
- Có getter `skip` và `take` để model dùng cho `OFFSET` và `LIMIT`.

### `pagination/page.ts`

- Định nghĩa class `Page<T>` chứa items, totalItems, page và limit.
- Tính `totalPages` cho response list.

### `pagination/paginationSchemas.ts`

- Chứa schema query dùng chung cho `page`, `limit`, `sort`, `order`.
- Chứa default pagination như `DEFAULT_PAGE`, `DEFAULT_LIMIT`, `MAX_LIMIT`.

## Thư Mục `prisma/`

Chứa cấu hình database schema, migration và seed dữ liệu mẫu cho Prisma.

### `prisma/schema.prisma`

- Định nghĩa Prisma models: `User`, `Category`, `Product`, `Tag`, `ProductTag`.
- Map tên field TypeScript sang tên cột database như `passwordHash` -> `password_hash`, `createdAt` -> `created_at`.
- Định nghĩa relation giữa product/category/tag.
- Cấu hình generated Prisma Client ra `generated/prisma`.

### `prisma/migrations/`

- Chứa migration SQL do Prisma dùng để tạo/cập nhật database.
- Không sửa migration cũ sau khi đã apply vào database dùng chung; nếu cần đổi schema thì tạo migration mới.

### `prisma/seed.ts`

- Seed dữ liệu mẫu bằng TypeScript.
- Tạo user mẫu, category, tag, product và relation product-tag.
- Chạy bằng `npm run prisma:seed`.

### `prisma.config.ts`

- Cấu hình đường dẫn schema, migration và `DATABASE_URL` cho Prisma CLI.
- Được Prisma CLI đọc khi chạy `prisma generate`, `prisma migrate dev`, `prisma db seed`.

## Thư Mục `dist/`

Thư mục output được sinh ra sau khi chạy:

```bash
npm run build
```

Đây là JavaScript đã biên dịch từ TypeScript. Không nên sửa file trong `dist/` bằng tay vì lần build tiếp theo sẽ ghi đè.

Cấu trúc `dist/` tương ứng source:

```txt
dist/
  server.js
  config/
  constants/
  controllers/
  docs/
  exceptions/
  middleware/
  models/
  pagination/
  routes/
  schemas/
  services/
  types/
```

Ý nghĩa các file trong `dist/`:

- `dist/src/server.js`: bản build của `src/server.ts`, được chạy bởi `npm start`.
- `dist/config/auth.js`: bản build của `config/auth.ts`.
- `dist/config/prisma.js`: bản build của `config/prisma.ts`.
- `dist/constants/httpStatus.js`: bản build của `constants/httpStatus.ts`.
- `dist/controllers/authController.js`: bản build của `controllers/authController.ts`.
- `dist/controllers/categoryController.js`: bản build của `controllers/categoryController.ts`.
- `dist/controllers/productController.js`: bản build của `controllers/productController.ts`.
- `dist/controllers/tagController.js`: bản build của `controllers/tagController.ts`.
- `dist/controllers/userController.js`: bản build của `controllers/userController.ts`.
- `dist/docs/openapi.js`: bản build của `docs/openapi.ts`.
- `dist/exceptions/httpException.js`: bản build của `exceptions/httpException.ts`.
- `dist/exceptions/commonExceptions.js`: bản build của `exceptions/commonExceptions.ts`.
- `dist/exceptions/exceptionMiddleware.js`: bản build của `exceptions/exceptionMiddleware.ts`.
- `dist/middleware/authenticateToken.js`: bản build của `middleware/authenticateToken.ts`.
- `dist/middleware/requestLogger.js`: bản build của `middleware/requestLogger.ts`.
- `dist/middleware/requireRole.js`: bản build của `middleware/requireRole.ts`.
- `dist/middleware/validateRequest.js`: bản build của `middleware/validateRequest.ts`.
- `dist/models/categoryModel.js`: bản build của `models/categoryModel.ts`.
- `dist/models/productModel.js`: bản build của `models/productModel.ts`.
- `dist/models/tagModel.js`: bản build của `models/tagModel.ts`.
- `dist/models/userModel.js`: bản build của `models/userModel.ts`.
- `dist/pagination/page.js`: bản build của `pagination/page.ts`.
- `dist/pagination/pageable.js`: bản build của `pagination/pageable.ts`.
- `dist/pagination/paginationSchemas.js`: bản build của `pagination/paginationSchemas.ts`.
- `dist/pagination/sort.js`: bản build của `pagination/sort.ts`.
- `dist/routes/authRoutes.js`: bản build của `routes/authRoutes.ts`.
- `dist/routes/categoryRoutes.js`: bản build của `routes/categoryRoutes.ts`.
- `dist/routes/productRoutes.js`: bản build của `routes/productRoutes.ts`.
- `dist/routes/tagRoutes.js`: bản build của `routes/tagRoutes.ts`.
- `dist/routes/userRoutes.js`: bản build của `routes/userRoutes.ts`.
- `dist/schemas/productRequestSchemas.js`: bản build của `schemas/productRequestSchemas.ts`.
- `dist/schemas/authSchemas.js`: bản build của `schemas/authSchemas.ts`.
- `dist/schemas/productSchemas.js`: bản build của `schemas/productSchemas.ts`.
- `dist/services/authService.js`: bản build của `services/authService.ts`.
- `dist/services/categoryService.js`: bản build của `services/categoryService.ts`.
- `dist/services/productService.js`: bản build của `services/productService.ts`.
- `dist/services/tagService.js`: bản build của `services/tagService.ts`.
- `dist/services/userService.js`: bản build của `services/userService.ts`.
- `dist/types/auth.js`: bản build của `types/auth.ts`.
- `dist/types/http.js`: bản build của `types/http.ts`.
- `dist/types/option.js`: bản build của `types/option.ts`.
- `dist/types/product.js`: bản build của `types/product.ts`.
- `dist/types/user.js`: bản build của `types/user.ts`.
- `dist/utils/catchErrors.js`: bản build của `utils/catchErrors.ts`.
- `dist/utils/jwt.js`: bản build của `utils/jwt.ts`.

## Thư Mục `node_modules/`

Thư mục dependency được npm cài đặt.

Chức năng:

- Chứa source của package bên thứ ba và package local linked.
- Được tạo khi chạy `npm install`.
- Được quản lý bởi `package.json` và `package-lock.json`.
- Không nên sửa trực tiếp file trong `node_modules/`.
- Không nên đưa vào Git.

README không liệt kê từng file con trong `node_modules/` vì đây là hàng nghìn file dependency sinh từ npm, không phải source code của project.

## Luồng Xác Thực Và Phân Quyền

1. Client gọi `POST /api/auth/login` với username/password.
2. `authController.login` gọi `authService.login`.
3. Service validate body, tìm user theo username, compare password bằng bcrypt.
4. Nếu hợp lệ, service tạo JWT có `sub` và `role`.
5. Client gửi JWT trong header `Authorization: Bearer <token>`.
6. Route cần bảo vệ gọi `authenticateToken`.
7. `authenticateToken` verify token và gắn `req.user`.
8. Route admin gọi thêm `requireRole("admin")`.
9. Nếu role hợp lệ, controller tiếp tục xử lý request.

## Luồng Product List

`GET /api/products` hỗ trợ:

- Pagination: `page`, `limit`.
- Sort: `sort`, `order`.
- Search: `search`.
- Filter: `category`, `minPrice`, `maxPrice`.

Ví dụ:

```http
GET /api/products?page=1&limit=10&sort=price&order=desc&search=phone&category=Phone&minPrice=100&maxPrice=1200
```

Response có dạng:

```json
{
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0,
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

## Quy Tắc Lỗi

Backend trả lỗi JSON thống nhất qua `HttpException` và `exceptionMiddleware`.

Lỗi validation:

```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "price": "Price must be a number greater than or equal to 0."
  }
}
```

Lỗi database unavailable:

```json
{
  "status": 503,
  "code": "SERVICE_UNAVAILABLE",
  "message": "Database unavailable"
}
```

Lỗi route không tồn tại:

```json
{
  "status": 404,
  "code": "NOT_FOUND",
  "message": "Route GET /unknown not found"
}
```

Lỗi server 5xx nội bộ sẽ được ẩn chi tiết và trả:

```json
{
  "status": 500,
  "code": "UNKNOWN_ERROR",
  "message": "Unknown error"
}
```

## Ghi Chú Phát Triển

- Controllers nên giữ mỏng, không đưa validation/business logic phức tạp vào controller.
- Services là nơi validate input và tạo lỗi HTTP.
- Models là nơi duy nhất nên gọi Prisma Client để truy cập database.
- Nếu cần đổi cấu trúc bảng, sửa `prisma/schema.prisma`, chạy migration rồi regenerate Prisma Client.
- Nếu thêm route cần auth, dùng `authenticateToken`.
- Nếu route chỉ dành cho admin, dùng thêm `requireRole("admin")`.
- Nếu thêm Zod schema backend, đặt trong `backend/schemas`; nếu thêm TypeScript type/helper, đặt trong `backend/types`.
- Không sửa file trong `dist/` và `node_modules/` bằng tay.
