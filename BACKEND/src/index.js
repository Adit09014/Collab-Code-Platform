import express from "express"
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import serverRoutes from './routes/server.route.js'
import channelRoutes from './routes/channel.route.js'
import categoryRoutes from './routes/category.route.js'
import channelMessageRoutes from './routes/groupmessage.route.js'
import projectRoutes from "./routes/project.route.js"
import projectFolderRoutes from "./routes/projectFolder.route.js"
import {connectDB} from './lib/db.js'
import cors from 'cors'
import {app,server,io} from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT ;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth", authRoutes);
app.use("/api/message",messageRoutes)
app.use("/api/server",serverRoutes)
app.use("/api/channel",channelRoutes)
app.use("/api/category",categoryRoutes)
app.use("/api/channelmessage",channelMessageRoutes)
app.use("/api/project",projectRoutes)
app.use("/api/projectFolder",projectFolderRoutes)

server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB();
});