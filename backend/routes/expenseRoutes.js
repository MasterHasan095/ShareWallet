import express from "express";
import { Expense } from "../models/expense.js";

const router = express.Router();

//Get all
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find({});

    return res.status(200).json({
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// // Get User By ID
// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findOne({ userID: id }); // Search using groupID

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send({ message: error.message });
//   }
// });

//Create
router.post("/", async (req, res) => {
  try {
    if (
      !req.body.groupID ||
      !req.body.amount ||
      !req.body.expenseName ||
      !req.body.typeOfSplit ||
      !req.body.payee ||
      !req.body.owee
    ) {
      return res.status(400).send({
        message: "Send all required fields: groupID, ",
      });
    }

    // Find the highest groupID
    const highestExpense = await Expense.findOne(
      {},
      {},
      { sort: { expenseID: -1 } }
    );
    let newExpenseID = 1; //
    if (highestExpense) {
      newExpenseID = highestExpense.expenseID + 1;
    }
    var owee = [];
    const numberOfOwees = req.body.owee.length;
    const amount = req.body.amount;
    switch (req.body.typeOfSplit) {
      case "equally":
        const indiAmount = amount / numberOfOwees;
        req.body.owee.map((indiOwee) => {
          return owee.push({
            ...indiOwee,
            amount: indiAmount,
          });
        });
        console.log(owee);
        break;
      case "unequally":
        req.body.owee.map((indiOwee) => {
          if (indiOwee.amount == null) {
            return res.status(400).send({
              message: "Amount cant be null ",
            });
          }
        });
        owee = req.body.owee
        break;
      case "By percentage":
        console.log("Percentage");
        break;
      case "By Shares":
        console.log("Shares");
        break;
    }
    const newExpense = {
      expenseID: newExpenseID,
      groupID: req.body.groupID,
      amount: req.body.amount,
      date: new Date(),
      expenseName: req.body.expenseName,
      typeOfSplit: req.body.typeOfSplit,
      payee: req.body.payee,
      owee: owee,
    };

    const expense = await Expense.create(newExpense);

    return res.status(201).send(expense);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// // Update
// router.put("/:id", async (req, res) => {
//   try {
//     if (!req.body.username || !req.body.email || !req.body.phoneNumber) {
//       return res.status(400).send({
//         message: "Send all required fields: username, email, phone number",
//       });
//     }

//     const { id } = req.params;

//     // Assuming 'User' is your Mongoose model
//     const result = await User.findOneAndUpdate({ userID: id }, req.body);

//     if (!result) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     return res.status(200).send({ message: "User Updated successfully" });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send({ message: error.message });
//   }
// });

// //Delete
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await User.findOneAndDelete({ userID: id });
//     if (!result) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send({ message: error.message });
//   }
// });

//Delete all expenses

router.delete("/", async (req, res)=>{
  try {
    const result = await Expense.deleteMany({});
    return res.status(200).json({ message: "All expenses deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
})

export default router;
