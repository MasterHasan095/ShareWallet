import express from "express";
import { Group } from "../models/groupModel.js";

const router = express.Router();

//Get all
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find({});

    return res.status(200).json({
      count: groups.length,
      data: groups,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Get Group By ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findOne({ groupID: id }); // Search using groupID

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.status(200).json(group);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//Get all users in a group
router.get("/:id/users", async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findOne({ groupID: id }); // Search using groupID

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.status(200).json({
      name : group.groupName,
      users: group.users
    }
      );
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//Create
router.post("/", async (req, res) => {
  try {
    if (!req.body.groupName) {
      return res.status(400).send({
        message: "Send all required fields: groupName",
      });
    }

    // Find the highest groupID
    const highestGroup = await Group.findOne({}, {}, { sort: { groupID: -1 } });
    let newGroupID = 1; // Default groupID if no groups exist yet
    if (highestGroup) {
      newGroupID = highestGroup.groupID + 1; // Increment the highest groupID
    }

    const newGroup = {
      groupID: newGroupID,
      groupName: req.body.groupName,
      users: req.body.users,
      balances: req.body.balances
    };

    const group = await Group.create(newGroup);

    return res.status(201).send(group);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//Update
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.groupName) {
      return res.status(400).send({
        message: "Send all required fields: groupName",
      });
    }

    const { id } = req.params;

    // Assuming 'Group' is your Mongoose model
    const result = await Group.findOneAndUpdate({ groupID: id }, req.body);

    if (!result) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res.status(200).send({ message: "Group Updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//Delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Group.findOneAndDelete({ groupID: id });
    if (!result) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//Delete all

router.delete("/", async (req, res)=>{
  try {
    const result = await Group.deleteMany({});
    return res.status(200).json({ message: "All groups deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
})

export default router;
