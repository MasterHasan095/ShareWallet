import mongoose from "mongoose";

const owee = mongoose.Schema(
{
    oweeID: {
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

export const Owee = mongoose.model('owee', owee);