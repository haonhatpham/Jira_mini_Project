require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");
const { Pool } = require("pg");

// Kept for legacy user data that still lives in db.json.
const DB_PATH = path.join(__dirname, "..", "db.json");

// PostgreSQL connection pool 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

const DATABASE_TIMEOUT_MS = 5000;

async function readDatabase() {
  const content = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(content);
}

async function writeDatabase(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// Run a parameterized SQL query through the shared pool.
async function query(text, params) {
  try {
    return await withDatabaseTimeout(pool.query(text, params));
  } catch (err) {
    if (err.statusCode === 503 || isConnectionError(err)) {
      throw createDatabaseUnavailableError();
    }
    throw err;
  }
}

// Borrow a client when a model needs a transaction.
async function connect() {
  try {
    return await withDatabaseTimeout(pool.connect());
  } catch (err) {
    if (err.statusCode === 503 || isConnectionError(err)) {
      throw createDatabaseUnavailableError();
    }

    throw err;
  }
}

function withDatabaseTimeout(operation) {
  let timeoutId;

  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(createDatabaseUnavailableError()), DATABASE_TIMEOUT_MS);
  });

  return Promise.race([operation, timeout]).finally(() => {
    clearTimeout(timeoutId);
  });
}

// Normalize common PostgreSQL connection/config failures to a 503 API error.
function isConnectionError(err) {
  const connectionErrorCodes = [
    "ECONNREFUSED",
    "ENOTFOUND",
    "ETIMEDOUT",
    "EAI_AGAIN",
    "3D000",
    "28P01",
  ];

  return connectionErrorCodes.includes(err.code)
    || err.message.includes("client password must be a string")
    || err.message.includes("SASL");
}

// The error middleware turns this into HTTP 503 Service Unavailable.
function createDatabaseUnavailableError() {
  const error = new Error("Database unavailable");
  error.statusCode = 503;
  return error;
}

module.exports = {
  connect,
  pool,
  query,
  readDatabase,
  writeDatabase,
};
