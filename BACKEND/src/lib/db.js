import mongoose from "mongoose";

export const connectDB= async()=>{
    try{
        const DBConnect = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Connected: ${DBConnect.connection.host}`);
    }
    catch(error){
        console.log("MongoDB connection error:",error);
    }
};