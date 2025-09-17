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
    languague:{
        type: String,
        required:true
    }
});

const Project = mongoose.model("Project",ProjectSchema);
export default Project