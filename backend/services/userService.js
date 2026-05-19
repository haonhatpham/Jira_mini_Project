const userModel = require("../models/userModel");

async function getUsers() {
  return userModel.findAllUsers();
}

module.exports = {
  getUsers,
};
