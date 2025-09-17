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

        const folders = await ProjectFolder.find({channel: channelId});
        res.status(200).json(folders);
    }
    catch(err){
        console.log("Error in getProjectFolder", err.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

export const addProjectFolder =  async(req,res)=>{
    const {foldername} = req.body;
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

        const newFolder= new ProjectFolder({
            foldername,
            channel:channelId
        })

        newFolder.save();

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