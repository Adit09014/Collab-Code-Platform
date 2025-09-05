import cloudinary from '../lib/cloudnary.js';
import {generateToken} from '../lib/token.js'
import User from '../models/user.js';
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    try {
        if (!req.body) {
            return res.status(400).json({message: "Request body is required"});
        }

        if (!fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"}); 
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "User already exists with this email"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt); 

        const newUser = new User({
            fullName,
            email,
            password: hashPassword 
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({message: "Invalid Data"});
        }

    } catch (err) {
        console.log("Error in the signup controller", err.message);
        res.status(500).json({message: "Internal server error"}); 
    }
}

export const login= async (req,res)=>{
    const {email,password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials."});
        }

        const isPassword = await bcrypt.compare(password,user.password);
        if(!isPassword){
            return res.status(400).json({message:"Invalid Credentials."});
        }

        generateToken(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email: user.email,
            profilePic:user.profilePic
        });
    }
    catch(error){
        console.log("Error in the login controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const logout= async (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message: "Logout successfully."});
    }
    catch(err){
        console.log("Error in logout controller",err.message);
        res.status(500).json({message: "Internal server error"})
    }
}

export const updateProfile = async( req,res)=>{
    try{
        const {profilePic}=req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message:"Profile Pic is required."})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser= await User.findByIdAndUpdate(
            userId,
            {profilePic: uploadResponse.secure_url},
            {new: true}
        );

        res.status(200).json(updatedUser);
    }
    catch(error){
        console.log("error in update profile:",error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const checkAuth = async (req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(err){
        console.log("Error in checkAuth controller",err.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const addFriend = async (req,res)=>{
    const {userId}= req.params;
    try {
        const myId= req.user._id;

        if(!userId){
            return res.status(400).json({message:"Friend Id is Required."})
        }

        if (myId.toString() === userId) {
            return res.status(400).json({ message: "You cannot add yourself as a friend." });
        }

        await User.findByIdAndUpdate(myId,{$addToSet:{friends:{user: userId}}});
        await User.findByIdAndUpdate(userId,{$addToSet:{friends:{user:myId}}});

        res.status(200).json({ message: "Friend added successfully!" });
    }
    catch (err) {
        console.log("Error in addFriend controller",err.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}