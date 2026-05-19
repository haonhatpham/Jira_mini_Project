const userService = require("../services/userService");

async function getUsers(req, res, next) {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
};
