import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true, 
        unique: true,
    },
    fullName:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required: true,
        minLength: 6
    },
    profilePic:{
        type: String,
        default: ""
    },
    friends:[{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }]
},
{timestamps: true}
);


const User= mongoose.model("User",UserSchema);
export default User;