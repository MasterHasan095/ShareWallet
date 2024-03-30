import mongoose from "mongoose";

const balanceSchema = mongoose.Schema({
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
    }  
});

export const Balance = mongoose.model('Balance', balanceSchema);
