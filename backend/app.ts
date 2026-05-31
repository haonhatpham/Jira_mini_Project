/**
 * File cau hinh Express app: gan middleware chung, Swagger va tat ca API route.
 */
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { HttpStatus } from "./constants/httpStatus.js";
import openapiDocument from "./docs/openapi.js";
import { exceptionMiddleware, notFoundHandler } from "./exceptions/index.js";
import { IDEMPOTENCY_HEADER } from "./idempotency/index.js";
import { requestLogger } from "./middleware/requestLogger.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Bat CORS cho moi truong dev de frontend localhost goi duoc API.
if (env.NODE_ENV !== "production") {
  app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", IDEMPOTENCY_HEADER],
    credentials: true,
    exposedHeaders: ["Idempotency-Replayed"],
  }));
}

app.use(express.json());
app.use(requestLogger);

// Tra OpenAPI document dang JSON cho tool/doc generator.
app.get("/api/openapi.json", (_req, res) => {
  res.status(HttpStatus.OK).json(openapiDocument);
});

// Hien thi Swagger UI dua tren OpenAPI document noi bo.
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument, {
  customSiteTitle: "Jira Mini Project API Docs",
}));

// Mount cac nhom route chinh cua backend.
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/users", userRoutes);

// Middleware cuoi cung: bat route khong ton tai va format moi loi thanh JSON.
app.use(notFoundHandler);
app.use(exceptionMiddleware);

export default app;
