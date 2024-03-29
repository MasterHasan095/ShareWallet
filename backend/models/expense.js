import mongoose from "mongoose";

const expense = mongoose.Schema(
{
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
    }       
}
)

export const Expense = mongoose.model('expense', expense);