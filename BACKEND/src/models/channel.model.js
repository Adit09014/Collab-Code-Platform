import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    type:{
        type: String,
        enum: ['text','voice','code'],
        required: true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required: true
    }
});

const Channel = mongoose.model("Channel",channelSchema);

export default Channel;