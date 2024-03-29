import mongoose from "mongoose";
const payee = mongoose.Schema({
  userID: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  }
});
const owee = mongoose.Schema({
    userID: {
      type: Number,
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    }
  });
const expense = mongoose.Schema({
  expenseID: {
    type: Number,
    required: true,
  },
  groupID: {
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
    type: [payee],
    required: true,
  },
  owee: {
    type: [owee],
    required: true,
  }
});

export const Expense = mongoose.model("expense", expense);
