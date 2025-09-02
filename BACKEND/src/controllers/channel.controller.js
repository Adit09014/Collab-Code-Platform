import mongoose from "mongoose";
import Channel from "../models/channel.model.js";
import Category from "../models/category.model.js";
import Server from "../models/server.model.js";

export const getChannel = async (req, res) => {
    try {
        const userId = req.user._id;
        const { categoryId } = req.params;

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

        const channels = await Channel.find({ category: categoryId });
        res.status(200).json(channels);

    } catch (err) {
        console.log("Error in getChannel", err.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const addChannel = async (req, res) => {
    const { name, type } = req.body;
    const { categoryId } = req.params;

    try {
        if (!name) {
            return res.status(400).json({ message: "Name is required." });
        }

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid categoryId." });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const server = await Server.findById(category.server);
        const userId = req.user._id;
        if (server.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only server owner can create channels." });
        }

        const newChannel = new Channel({
            name,
            type,
            category: categoryId
        });

        await newChannel.save();

        res.status(201).json({
            _id: newChannel._id,
            name: newChannel.name,
            type: newChannel.type,
            category: newChannel.category
        });

    } catch (err) {
        console.log("Error in addChannel", err.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};
