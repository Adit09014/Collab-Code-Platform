import User from "../models/user.js";
import Server from "../models/server.model.js";
import Channel from "../models/channel.model.js";
import cloudinary from "../lib/cloudnary.js";
import Category from "../models/category.model.js";

export const addServer = async (req, res) => {
    const { name, description } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ message: "Name is required." });
        }

        const ownerId = req.user?._id;
        if (!ownerId) {
            return res.status(401).json({ message: "Unauthorized. Owner not found." });
        }

        const newServer = new Server({
            name,
            description,
            owner: ownerId, 
            members: [{ user: ownerId, roles: ["owner"] }] 
        });

        await newServer.save();

        const textCategory = await Category.create({ name: "Text Channel", server: newServer._id });
        const voiceCategory = await Category.create({ name: "Voice Channel", server: newServer._id });

        const defaultChannels = [
            { name: "general", type: "text", category: textCategory._id },
            { name: "general", type: "voice", category: voiceCategory._id }
        ];

        await Channel.insertMany(defaultChannels.map(ch => ({ ...ch, server: newServer._id })));

        res.status(201).json({
            _id: newServer._id,
            name: newServer.name,
            description: newServer.description,
            owner: newServer.owner
        });

    } catch (err) {
        console.log("Error in addServer", err.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const getServer= async(req,res)=>{
    try{
        const userId= req.user._id;

        const server= await Server.find({
            "members.user": userId
        });

        res.status(200).json(server);
    }
    catch(err){
        console.log("Error in getServer",err.message);
        res.status(500).json({message: "Internal Server Error."})
    }
};

export const addMember= async(req,res)=>{
    const {serverId,memberId} = req.params;
    try{
         const server = await Server.findById(serverId);
        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        const alreadyMember = server.members.some(
            (m) => m.user.toString() === memberId
        );
        if (alreadyMember) {
            return res.status(400).json({ message: "User already in server" });
        }

       
        server.members.push({
            user: memberId,
            roles: ["member"], 
        });

        await server.save();

        const updatedServer = await Server.findById(serverId).populate(
            "members.user",
            "-password"
        );

        res.status(200).json(updatedServer);
    }
    catch(err){
        console.log("Error in addMember",err.message);
        res.status(500).json({message: "Internal Server Error."})
    }
}