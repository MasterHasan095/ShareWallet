import mongoose from "mongoose";


const groupSchema = mongoose.Schema({
  groupID: {
    type: Number,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  users: [
    {
      userID: {
        type: Number,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },
  ],
  balances: [
    {
      user1_ID: {
        type: Number,
        required: true,
      },
      user2_ID: {
        type: Number,
        required: true,
      },
      balance: {
        type: Number,
        required: true,
      },
    },
  ],
  expenses: [{
    expenseID: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    expenseName: {
      type: String,
      required: true,
    },
    typeOfSplit: {
      type: String,
      required: true,
    },
    payee: {
      type: [
        {
          userID: {
            type: Number,
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
    owee: {
      type: [
        {
          userID: {
            type: Number,
            required: true,
          },
          amount: {
            type: Number,
            required: false,
          },
        },
      ],
      required: true,
    },
  }]
});

export const Group = mongoose.model("Group", groupSchema);
