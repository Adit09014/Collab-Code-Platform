import mongoose from "mongoose";

const serverSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type:String
    },
    icon:{
        type: String,

    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members:[{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        roles:[{
            type: String,
            ref:'Role'
        }]
    }],
    roles:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Role"
    }]
});

const Server = mongoose.model("Server",serverSchema);

export default Server;