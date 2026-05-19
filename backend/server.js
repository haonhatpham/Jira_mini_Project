const cors = require("cors");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapiDocument = require("./docs/openapi");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { requestLogger } = require("./middleware/auth");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/api/openapi.json", (req, res) => {
  res.status(200).json(openapiDocument);
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument, {
  customSiteTitle: "Jira Mini Project API Docs",
}));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
