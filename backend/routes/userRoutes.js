import express from "express";
import { User } from "../models/user.js";

const router = express.Router();

//Get all
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});

    return res.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Get User By ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ userID: id }); // Search using groupID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//Create
router.post("/", async (req, res) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.phoneNumber) {
      return res.status(400).send({
        message: "Send all required fields: username, email, phonenumber",
      });
    }

    // Find the highest groupID
    const highestUser = await User.findOne({}, {}, { sort: { userID: -1 } });
    let newUserID = 1; // 
    if (highestUser) {
      newUserID = highestUser.userID + 1; // Increment the highest groupID
    }

    const newUser = {
      userID: newUserID,
      username: req.body.username,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
    };

    const user = await User.create(newUser);

    return res.status(201).send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.phoneNumber) {
      return res.status(400).send({
        message: "Send all required fields: username, email, phone number",
      });
    }

    const { id } = req.params;

    // Assuming 'User' is your Mongoose model
    const result = await User.findOneAndUpdate({ userID: id }, req.body);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).send({ message: "User Updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//Delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.findOneAndDelete({ userID: id });
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});


export default router;
