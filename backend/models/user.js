import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userID: {
        type: Number,
        required: true,
    },
    username: {
        type: String, // Change the type to String
        required: true,
    },
    email: {
        type: String, // Change the type to String
        required: true,
    },
    phoneNumber: {
        type: String, // Change the type to String
        required: true,
    }    
});

export const User = mongoose.model('User', userSchema);
