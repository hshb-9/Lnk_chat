import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const users = await User.find().select("full_name profile_pic");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sidebar users" });
  }
};
