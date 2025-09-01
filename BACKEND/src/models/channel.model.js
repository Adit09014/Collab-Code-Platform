import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    type:{
        type: String,
        enum: ['text','voice'],
        required: true
    },

    server:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Server',
        required: true
    }
});

const Channel = mongoose.model("Channel",channelSchema);

export default Channel;