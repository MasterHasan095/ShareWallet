import mongoose from "mongoose";

const groupMemberSchema = mongoose.Schema(
{
    groupMemberID: {
        type: Number,
        required: true,
    },
    groupID: {
        type: Number,
        required: true,
    },
    userID: {
        type: Number,
        required: true,
    }    
}
)

export const GroupMember = mongoose.model('groupMembers', groupMemberSchema);