import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema(
    {
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    text:{
        type: String
    },
    image:{
        type: String
    },
    channelId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Channel",
        required: true
    }
    },
    {timestamps: true}
);


const GroupMessage = mongoose.model("GroupMessage",groupMessageSchema);

export default GroupMessage;
