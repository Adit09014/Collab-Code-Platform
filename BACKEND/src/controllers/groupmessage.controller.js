import User from '../models/user.js';
import GroupMessage from '../models/groupmessage.model.js';
import Category from '../models/category.model.js';
import Channel from '../models/channel.model.js';
import cloudinary from '../lib/cloudnary.js'
import { getReceiverSocketId,io } from '../lib/socket.js';
import Server from '../models/server.model.js';


export const getChannelUsers = async (req, res) => {
    const { channelId } = req.params;
    try {
        
        const channel = await Channel.findOne({ _id: channelId });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        
        const category = await Category.findOne({ _id: channel.categoryId });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        
        const server = await Server.findById(category.server).populate('members', '-password');
        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        res.status(200).json(server.members);
    }
    catch(err) {
        console.log("Error in getUsers", err.message);
        res.status(500).json({error: "Internal Server error"});
    }
}

export const getChannelMessages = async(req,res)=>{
    try{
        const {channelId} = req.params;

        const messages= await GroupMessage.find({channelId}).populate('senderId','fullName profilePic').sort({createdAt:1});

        res.status(200).json(messages);
    }
    catch(err){
        console.log("Error in getChannelMessages", err.message);
        res.status(500).json({error: "Internal Server error"});
    }
}

export const sendChannelMessages= async (req,res)=>{
    try{
        const {channelId}= req.params;
        const senderId= req.user._id;
        const {text,image}= req.body;

        let imageURL;

        if(image){
            const uploadResponse= await cloudinary.uploader.upload(image);
            imageURL= uploadResponse.secure_url;
        }

        const newMessage= new GroupMessage({
            senderId,
            channelId,
            text,
            image:imageURL,
        });

        await newMessage.save();
        const savedMessage = await newMessage.populate("senderId", "fullName profilePic");
        io.to(`channel_${channelId}`).emit("newChannelMessage", {
            message: savedMessage,
            channelId: channelId
        });
        res.status(201).json(savedMessage);
    }
    catch(err){
        console.log("Error in sendMessages",err.message);
        res.status(500).json({error: "Internal server error"})
    }
}