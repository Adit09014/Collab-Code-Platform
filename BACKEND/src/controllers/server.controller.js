import User from "../models/user.js";
import Server from "../models/server.model.js";
import cloudinary from "../lib/cloudnary.js";

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

        const defaultChannels = [
            {name: "general",type: "text",server: server._id},
            {name:"general",type: "voice", server: server._id}
        ];

        await Channel.insertMany(defaultChannels);

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
}