import mongoose from "mongoose";

const ProjectFolderSchema = new mongoose.Schema({
    foldername:{
        type: String,
        required: true
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Channel",
        required: true
    }
});

const ProjectFolder = mongoose.model("ProjectFolder",ProjectFolderSchema);

export default ProjectFolder;