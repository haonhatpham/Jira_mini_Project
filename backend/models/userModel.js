const { readDatabase } = require("../config/db");

async function findAllUsers() {
  const db = await readDatabase();
  return db.users;
}

module.exports = {
  findAllUsers,
};
