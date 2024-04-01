import express from "express";
import { Group } from "../models/groupModel.js";
import { User } from "../models/user.js";

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
      balances: req.body.balances,
      expenses: req.body.expenses,
    };

    const group = await Group.create(newGroup);

    return res.status(201).send(group);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//Add user to a group
//Add user to a group
router.post("/addUser/:groupID/:userID", async (req, res) => {
  try {
    const { userID, groupID } = req.params;

    // Find the user by userID
    const fetchedUser = await User.findOne({ userID: userID });
    if (!fetchedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the group by groupID
    const group = await Group.findOne({ groupID: groupID });
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user already exists in the group
    const existingUser = group.users.find(user => user.userID === fetchedUser.userID);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists in the group" });
    }

    // Add the user to the group
    group.users.push({
      userID: fetchedUser.userID,
      username: fetchedUser.username
    });

    for (const user of group.users) {
      if (user.userID !== fetchedUser.userID) {
        group.balances.push({
          user1_ID: user.userID,
          user2_ID: fetchedUser.userID,
          balance: 0 // Default balance for now
        });
        group.balances.push({
          user1_ID: fetchedUser.userID,
          user2_ID: user.userID,
          balance: 0 // Default balance for now
        });
      }
    }

    // Save the updated group
    await group.save();

    fetchedUser.groups.push({
      groupID: group.groupID,
      groupName: group.groupName
    });
    await fetchedUser.save();

    // Return success response with updated group
    return res.status(200).json({ message: "User added to the group successfully", group: group });

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


// Remove user from a group
router.delete("/removeUser/:groupID/:userID", async (req, res) => {
  try {
    const { userID, groupID } = req.params;

    // Find the group by groupID
    const group = await Group.findOne({ groupID: groupID });
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user exists in the group
    const existingUserIndex = group.users.findIndex(user => user.userID === userID);
    if (existingUserIndex === -1) {
      return res.status(404).json({ message: "User not found in the group" });
    }

    // Check if the user's balance with everyone is 0
    const userBalances = group.balances.filter(balance => balance.user1_ID === userID);
    const allBalancesZero = userBalances.every(balance => balance.balance === 0);
    if (!allBalancesZero) {
      return res.status(400).json({ message: "Cannot remove user, their balance with someone is not 0" });
    }

    // Remove the user from the group
    group.users.splice(existingUserIndex, 1);

    // Remove the user's balances from the balances array
    group.balances = group.balances.filter(balance => balance.user1_ID !== userID && balance.user2_ID !== userID);

    // Recalculate balances based on expenses or any other criteria

    // Save the updated group
    await group.save();

    const user = await User.findOne({ userID: userID });
    if (user) {
      user.groups = user.groups.filter(group => group.groupID !== groupID);
      await user.save();
    }

    // Return success response with updated group
    return res.status(200).json({ message: "User removed from the group successfully", group: group });

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});


export default router;
