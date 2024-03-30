import mongoose from "mongoose";
import { User } from "./user.js"; // Assuming this is where you define your User model
import { Balance } from "./balance.js";

const groupSchema = mongoose.Schema({
  groupID: {
    type: Number,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  balance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Balance' }]
//   balance: {
//     type: [Balance],
//     required: true,
//   },
});

export const Group = mongoose.model("Group", groupSchema);
