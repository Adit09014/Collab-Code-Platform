import mongoose from "mongoose";
import Server from "../models/server.model.js";
import Category from '../models/category.model.js';


export const getCategory = async (req,res)=>{
    try{
        const userId= req.user._id;
        const {serverId}= req.params;

        const server= await Server.findOne({
            _id:serverId,
            "members.user":userId
        })

        if(!server){
            return res.status(403).json({message: "You are not a member of the Server."});
        }


        const categories= await Category.find({server: serverId});
        
        res.status(200).json(categories);
    }
    catch(err){
        console.log("Error in getCategory",err.message);
        res.status(500).json({error: "Internal Server error1"});
    }
}

export const addCategory= async (req,res)=>{
    const {name} = req.body;
    const {serverId}= req.params;
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
            return res.status(403).json({ message: "Only server owner can create categories." });
        }

        const newCategory= new Category({
            name,
            server: serverId
        })

        await newCategory.save();

        res.status(200).json({
            _id: newCategory._id,
            name: newCategory.name,
            server: newCategory.server
        });
    }
    catch(err){
        console.log("Error in addCategory.",err.message);
        res.status(500).json({error: "Internal Server Error."});
    }
}