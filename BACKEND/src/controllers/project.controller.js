import mongoose from "mongoose";
import Project from "../models/project.model.js";
import ProjectFolder from "../models/projectFolder.model.js";
import Channel from "../models/channel.model.js";
import Category from "../models/category.model.js";
import Server from "../models/server.model.js";


export const getProject = async(req,res)=>{
    const {folderId} = req.params;
    try{
        const userId = req.user._id;
        const folder = await ProjectFolder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        const channelId = folder.channel;

        const channel = await Channel.findById(channelId)
        if(!channel){
            return res.status(400).json({ message: "Channel not Found." });
        }

        const categoryId=channel.category;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const server = await Server.findOne({
            _id: category.server,
            "members.user": userId
        });
        if (!server) {
            return res.status(403).json({ message: "You are not a member of this server." });
        }

        const project = await Project.find({folder:folderId});
        res.status(200).json(project);
    }
    catch(err){
        console.log("Error in getProject", err.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}  

export const addProject = async(req,res)=>{
    const {name,language} = req.body;
    const {folderId} = req.params;

    try{
        if(!name || !language){
            return res.status(400).json({ message: "Project Name and language is required." });
        }
        if (!mongoose.Types.ObjectId.isValid(folderId)) {
            return res.status(400).json({ message: "Invalid folderId." });
        }

        const folder = await ProjectFolder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        } 

        const newProject = new Project({
            filename:name,
            folder:folderId,
            language
        });

        await newProject.save();

        res.status(201).json({
            id: newProject._id,
            filename: newProject.filename,
            folder: newProject.folder,
            language: newProject.language
        });


    }
    catch(err){
        console.log("Error in addProject", err.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}