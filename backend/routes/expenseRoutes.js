import express from "express";
import { Group } from "../models/groupModel.js";

const router = express.Router();

// Get all expenses of the group
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findOne({ groupID: id }); // Search using groupID

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.status(200).json(group.expenses);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//Get an individual expense

router.get("/:groupID/:expenseID", async (req, res) => {
  try {
    const { groupID, expenseID } = req.params;
    const group = await Group.findOne({ groupID: groupID }); // Search using groupID

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const expense = group.expenses.find(
      (expense) => expense.expenseID == expenseID
    );
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json(group.expense);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//Create
router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findOne({ groupID: id }); // Search using groupID
    if (
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

    let highestExpenseID = 0;
    group.expenses.forEach((expense) => {
      if (expense.expenseID > highestExpenseID) {
        highestExpenseID = expense.expenseID;
      }
    });

    let newExpenseID = 1; //
    if (highestExpenseID) {
      newExpenseID = highestExpenseID + 1;
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
        break;
      case "unequally":
        console.log("Yaha Test");
        let tempOweeAmount = 0;
        let tempPayeeAmount = 0;
        req.body.payee.map((indiPayee) => {
          if (indiPayee.amount == null) {
            return res.status(400).send({
              message: "Amount cant be null ",
            });
          }
          tempPayeeAmount += indiPayee.amount;
        });

        if (req.body.amount != tempPayeeAmount) {
          return res.status(400).send({
            message: "total amount not crrect ",
          });
        }
        req.body.owee.map((indiOwee) => {
          if (indiOwee.amount == null) {
            return res.status(400).send({
              message: "Amount cant be null ",
            });
          }
          tempOweeAmount += indiOwee.amount;
        });
        if (tempPayeeAmount != tempOweeAmount) {
          return res.status(400).send({
            message: "Not enough owee amount ",
          });
        }
        owee = req.body.owee;
        break;
      case "By percentage":
        console.log("Checkpint");
        console.log(req.body);
        const totalPercentage = req.body.owee.reduce(
          (total, owee) => total + owee.amount,
          0
        );

        if (totalPercentage !== 100) {
          return res
            .status(400)
            .json({ message: "Total percentage must be 100%" });
        }

        let totalAmount = req.body.amount;
        let KeepThisTemp = 0;
        req.body.payee.map((indiPayee) => {
          if (indiPayee.amount == null) {
            return res.status(400).send({
              message: "Amount cant be null ",
            });
          }
          KeepThisTemp += indiPayee.amount;
        });
        if (totalAmount != KeepThisTemp) {
          return res.status(400).send({
            message: "total amount not crrect ",
          });
        }
        req.body.owee.forEach((oweer) => {
          const percentageAmount = (oweer.amount / 100) * totalAmount;

          owee.push({
            userID: oweer.userID,
            username: oweer.username,
            amount: percentageAmount,
          });
        });

        req.body.amount = totalAmount;
        break;
      case "By Shares":
        const totalShares = req.body.owee.reduce(
          (total, owee) => total + owee.amount,
          0
        );

        if (totalShares === 0) {
          return res
            .status(400)
            .json({ message: "Total shares cannot be zero" });
        }

        let tempTotalAmount = req.body.amount;
        let KepThisTemp = 0;
        req.body.payee.map((indiPayee) => {
          if (indiPayee.amount == null) {
            return res.status(400).send({
              message: "Amount cant be null ",
            });
          }
          KepThisTemp += indiPayee.amount;
        });
        if (tempTotalAmount != KepThisTemp) {
          return res.status(400).send({
            message: "total amount not crrect ",
          });
        }
        req.body.owee.forEach((oweer) => {
          const shareAmount = (oweer.amount / totalShares) * tempTotalAmount;
          owee.push({
            userID: oweer.userID,
            username: oweer.username,
            amount: shareAmount,
          });
        });
        // console.log("here");
        break;
    }

    const newExpense = {
      expenseID: newExpenseID,
      amount: req.body.amount,
      date: new Date(),
      expenseName: req.body.expenseName,
      typeOfSplit: req.body.typeOfSplit,
      payee: req.body.payee,
      owee: owee,
    };

    group.expenses.push(newExpense);

    if (req.body.payee.length == 1) {
      const payee = req.body.payee[0].userID;
      owee.forEach((user) => {
        group.balances.forEach((balance) => {
          if (balance.payee == payee && balance.owee == user.userID) {
            balance.balance += user.amount;
          }
        });
      });
    } else {
      // let highestPayee = {userID: 0, amount: 0};
      req.body.payee.forEach((payee) => {
        //Gets eveything to 0 if possible
        owee.forEach((user) => {
          if (payee.userID == user.userID) {
            if (payee.amount > user.amount) {
              payee.amount -= user.amount;
              user.amount = 0;
            } else if (payee.amount < user.amount) {
              user.amount -= payee.amount;
              payee.amount = 0;
            }
          }
        });
      });

      req.body.payee.forEach((payee) => {
        owee.forEach((user) => {
          if (user.amount != 0) {
            if (payee.amount > user.amount) {
              group.balances.forEach((balance) => {
                if (
                  balance.payee == payee.userID &&
                  balance.owee == user.userID
                ) {
                  balance.balance += user.amount;
                }
              });
              payee.amount -= user.amount;
              user.amount = 0;
            } else {
              group.balances.forEach((balance) => {
                if (
                  balance.payee == payee.userID &&
                  balance.owee == user.userID
                ) {
                  balance.balance += payee.amount;
                }
              });
              user.amount -= payee.amount;
              payee.amount = 0;
            }
          }
        });
      });
    }

    await group.save();

    return res

      .status(200)
      .json({ message: "Expense added successfully", expense: newExpense });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// // // Update
// // router.put("/:id", async (req, res) => {
// //   try {
// //     if (!req.body.username || !req.body.email || !req.body.phoneNumber) {
// //       return res.status(400).send({
// //         message: "Send all required fields: username, email, phone number",
// //       });
// //     }

// //     const { id } = req.params;

// //     // Assuming 'User' is your Mongoose model
// //     const result = await User.findOneAndUpdate({ userID: id }, req.body);

// //     if (!result) {
// //       return res.status(404).json({ message: "User not found" });
// //     }
// //     return res.status(200).send({ message: "User Updated successfully" });
// //   } catch (error) {
// //     console.log(error.message);
// //     res.status(500).send({ message: error.message });
// //   }
// // });

// Update balances after deleting an expense
router.delete("/:groupID/:expenseID", async (req, res) => {
  try {
    const { groupID, expenseID } = req.params;
    const group = await Group.findOne({ groupID: groupID });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Find the index of the expense in the expenses array
    const deletedExpenseIndex = group.expenses.findIndex(
      (expense) => expense.expenseID === parseInt(expenseID)
    );

    if (deletedExpenseIndex === -1) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Extract the deleted expense
    const deletedExpense = group.expenses[deletedExpenseIndex];

    // Remove the expense from the expenses array
    group.expenses.splice(deletedExpenseIndex, 1);

    // Update balances after deleting the expense
    await updateBalances(group, deletedExpense);

    // Save the updated group
    await group.save();

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Function to update balances after deleting an expense
const updateBalances = async (group, deletedExpense) => {
  try {
    const payees = deletedExpense.payee;
    const owees = deletedExpense.owee;

    // Iterate through each payee
    for (const payee of payees) {
      // If there is only one payee, update balances between payee and owees
      if (payees.length === 1) {
        const payeeID = payee.userID;
        for (const owee of owees) {
          const oweeID = owee.userID;
          // Find the balance entry for this payee and owee
          const balanceToUpdate = group.balances.find(
            (balance) => balance.payee === payeeID && balance.owee === oweeID
          );
          if (balanceToUpdate) {
            // Deduct the owed amount from the balance
            balanceToUpdate.balance -= owee.amount;
          }
        }
      } else {
        // If there are multiple payees, adjust balances accordingly
        for (const owee of owees) {
          const oweeID = owee.userID;
          // Find the balance entry for this payee and owee
          const balanceToUpdate = group.balances.find(
            (balance) =>
              balance.payee === payee.userID && balance.owee === oweeID
          );
          if (balanceToUpdate) {
            // Deduct the owed amount from the balance
            balanceToUpdate.balance -= owee.amount;
          }
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to update balances");
  }
};

// //Delete all expenses

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findOne({ groupID: id }); // Search using groupID
    group.expenses = [];
    group.balances.forEach((balance) => {
      balance.balance = 0;
    });

    await group.save();
    return res
      .status(200)
      .json({ message: "All expenses deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
