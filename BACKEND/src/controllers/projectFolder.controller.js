import mongoose from "mongoose";
import Channel from "../models/channel.model.js";
import Category from "../models/category.model.js";
import Server from "../models/server.model.js";
import ProjectFolder from "../models/projectFolder.model.js";

export const getProjectFolder =  async(req,res)=>{
    const {channelId} = req.params;
    try{
        const userId= req.user._id;
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

        const folders = await ProjectFolder.find({channel: channelId}).lean();

        const folderMap = {};
        folders.forEach(f=>{
            folderMap[f._id] = {...f,subfolders:[]};
        });

        const rootFolders = [];
        folders.forEach(f => {
            if (f.folder) {
                folderMap[f.folder]?.subfolders.push(folderMap[f._id]);
            } else {
                rootFolders.push(folderMap[f._id]);
            }
        });
        res.status(200).json(rootFolders);
    }
    catch(err){
        console.log("Error in getProjectFolder", err.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

export const addProjectFolder =  async(req,res)=>{
    const {foldername,parentFolder} = req.body;
    const {channelId} = req.params;
    try{
        if(!foldername){
            return res.status(400).json({ message: "Folder Name is required." });
        }
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ message: "Invalid channelId." });
        }

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const category = await Category.findById(channel.category);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const server = await Server.findOne({
            _id: category.server,
            "members.user": req.user._id
        });
        if (!server) {
            return res.status(403).json({ message: "You are not a member of this server." });
        }

        const newFolder= new ProjectFolder({
            foldername,
            channel:channelId,
            folder: parentFolder || null
        })

        await newFolder.save();

        res.status(201).json({
            id:newFolder._id,
            foldername:newFolder.foldername,
            channel: newFolder.channel
        });
        

    }
    catch(err){
        console.log("Error in addProjectFolder", err.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}