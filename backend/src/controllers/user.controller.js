import User from "../models/user.model.js";
// If this is how you're exporting in controller.js:
module.exports = {
  getUsersForSidebar,
};

// Then in user.route.js, change the import to:
const { getUsersForSidebar } = require('../controllers/user.controller');

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};
