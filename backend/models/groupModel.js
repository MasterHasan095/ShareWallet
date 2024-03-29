import mongoose from "mongoose";

const groupSchema = mongoose.Schema(
{
    groupID: {
        type: Number,
        required: true,
    },
    groupName: {
        type: String,
        required: true,
    }    
}
)

export const Group = mongoose.model('group', groupSchema);