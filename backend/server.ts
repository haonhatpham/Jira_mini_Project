/**
 * File entrypoint: khoi dong HTTP server va xu ly tin hieu dung app.
 */
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./logger/logger.js";

// Lang nghe port da cau hinh va ghi log khi backend san sang nhan request.
const server = app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} on port ${env.PORT}`);
});

// Dong server gon gang khi nhan Ctrl+C trong terminal.
process.on("SIGINT", () => {
  // Callback nay chay sau khi server ngung nhan connection moi va dong xong.
  server.close(() => {
    logger.info("Exit Server Express");
  });
});
