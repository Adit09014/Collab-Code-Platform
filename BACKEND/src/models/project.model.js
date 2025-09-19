import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    filename:{
        type: String,
        required: true
    },
    folder:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ProjectFolder",
        required: true
    },
    language:{
        type: String,
        required:true
    },
    code:{
        type:String,
        default:"",
    }
});

const Project = mongoose.model("Project",ProjectSchema);
export default Project