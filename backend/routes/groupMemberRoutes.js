import express from "express";
import { GroupMember } from "../models/groupMemberModel.js";
import { Group } from "../models/groupModel.js";
import { User } from "../models/user.js";

const router = express.Router();

//Get all
router.get("/", async (req, res) => {
  try {
    const members = await GroupMember.find({});

    return res.status(200).json({
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Get Group Members By ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const member = await GroupMember.findOne({ groupMemberID: id });

    if (!member) {
      return res.status(404).json({ message: "Group Member not found" });
    }

    return res.status(200).json(member);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//Create
router.post("/", async (req, res) => {
  try {
    if (!req.body.groupID || !req.body.userID) {
      return res.status(400).send({
        message: "Send all required fields: groupID, userID",
      });
    }

    const user = await User.findOne({ userID: req.body.userID });
    const group = await Group.findOne({ groupID: req.body.groupID });

    // Find the highest groupID
    const highestMember = await GroupMember.findOne(
      {},
      {},
      { sort: { groupMemberID: -1 } }
    );

    let newGroupMemberID = 1;
    if (highestMember) {
      newGroupMemberID = highestMember.groupMemberID + 1;
    }
    if (user && group) {
      const newGroupMember = {
        groupMemberID: newGroupMemberID,
        groupID: req.body.groupID,
        userID: req.body.userID,
      };

      const groupMember = await GroupMember.create(newGroupMember);

      return res.status(201).send(groupMember);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//Delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await GroupMember.findOneAndDelete({ groupMemberID: id });
    if (!result) {
      return res.status(404).json({ message: "Group Member not found" });
    }

    return res.status(200).json({ message: "Group member deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
