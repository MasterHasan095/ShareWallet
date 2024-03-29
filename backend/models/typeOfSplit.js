import mongoose from "mongoose";

const typeOfSplit = mongoose.Schema(
{
    typeID: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },      
}
)

export const Types = mongoose.model('typeOfSplt', typeOfSplit);