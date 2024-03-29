import mongoose from "mongoose";

const payee = mongoose.Schema(
{
    paymentID: {
        type: Number,
        required: true,
    },
    expenseID: {
        type: Number,
        required: true,
    },
    userID: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }    
}
)

export const Payee = mongoose.model('payee', payee);