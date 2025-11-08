import User from "../models/user.js";
import Server from "../models/server.model.js";
import Channel from "../models/channel.model.js";
import cloudinary from "../lib/cloudnary.js";
import Category from "../models/category.model.js";
import Role from "../models/roles.model.js";

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
        });

        const ownerRole = await Role.create({
            name: "Owner",
            permissions: [
                "read",
                "write",
                "manage_messages",
                "manage_roles",
                "manage_server",
                "kick_members",
                "invite_members"
            ],
            server: newServer._id
        })

        const memberRole = await Role.create({
            name: "Member",
            permissions: ["read", "write"],
            server: newServer._id
        })

        newServer.roles.push(ownerRole._id, memberRole._id)

        newServer.members.push({
            user: ownerId,
            roles: [ownerRole._id]
        })

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

        const server= await Server.find({"members.user": userId})
        .populate("members.user", "fullName email")
        .populate("members.roles", "name permissions")
        .populate("roles", "name permissions")

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

        const memberRole = await Role.findOne({ server: serverId, name: "Member" })
        if (!memberRole) return res.status(404).json({ message: "Default Member role not found" })
       
        server.members.push({
            user: memberId,
            roles: [memberRole._id], 
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