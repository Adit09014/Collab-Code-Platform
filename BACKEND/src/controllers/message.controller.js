import User from '../models/user.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudnary.js'

export const getUsers = async (req,res)=>{
    try{
        const loggedinuser = req.user._id
        const filterUser = await User.find({_id: {$ne : loggedinuser}}).select("-password");

        res.status(200).json(filterUser);
    }
    catch(err){
        console.log("Error in getUsers",err.message);
        res.status(500).json({error: "Internal Server error"});
    }
}

export const getMessages = async(req,res)=>{
    try{
        const {id: chatId}= req.params;
        const myId= req.user._id;
    
        const messages= await Message.find({
            $or:[
                {senderId: myId, receiverId: chatId},
                {senderId: chatId, receiverId: myId}
            ]
        });
        res.status(200).json(messages);
    }
    catch(err){
        console.log("Error in getMessages",err.message);
        res.status(500).json({error:"Internal Server error"});
    }
}

export const sendMessages= async (req,res)=>{
    try{
        const {id: chatId}= req.params;
        const myId= req.user._id;

        const {text,image}= req.body;

        let imageURL;

        if(image){
            const uploadResponse= await cloudinary.uploader.upload(image);
            imageURL= uploadResponse.secure_url;
        }

        const newMessage= new Message({
            senderId: myId,
            receiverId: chatId,
            text,
            image:imageURL
        });

        await newMessage.save();

        res.status(201).json(newMessage);
    }
    catch(err){
        console.log("Error in sendMessages",err.message);
        res.status(500).json({error: "Internal server error"})
    }
}