import mongoose from "mongoose";
import Channel from "../models/channel.model.js";
import Server from "../models/server.model.js";

export const getChannel= async (req,res)=>{
    try{
        const userId= req.user._id;
        const {serverId} = req.params;

        const server= await Server.findOne({
            _id:serverId,
            "members.user":userId
        })

        if(!server){
            return res.status(403).json({message: "You are not a member of the Server."});
        }

        const channels= await Channel.find({server: serverId});

        res.status(200).json(channels);
    }
    catch(err){
        console.log("Error in getChannel",err.message);
        res.status(500).json({message: "Internal Server Error."})
    }
}

export const addChannel= async (req,res)=>{
    const {name,type}=req.body;
    const {serverId}=req.params;

    try{
        if (!name) {
            return res.status(400).json({ message: "Name is required." });
        }

        if (!mongoose.Types.ObjectId.isValid(serverId)) {
            return res.status(400).json({ message: "Invalid serverId." });
        }

        const server = await Server.findById(serverId);
        const userId= req.user._id;
        const isOwner = server.owner.toString() === userId.toString();
        if (!isOwner) {
            return res.status(403).json({ message: "Only server owner can create channels." });
        }

        const newChannel= new Channel({
            name,
            type,
            server: serverId
        })

        await newChannel.save();

        res.status(200).json({
            _id: newChannel._id,
            name: newChannel.name,
            type: newChannel.type,
            server: newChannel.server
        })
    }
    catch(err){
        console.log("Error in addChannel", err.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}
