import express from "express"
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import serverRoutes from './routes/server.route.js'
import channelRoutes from './routes/channel.route.js'
import {connectDB} from './lib/db.js'
import cors from 'cors'

dotenv.config();

const PORT = process.env.PORT ;

const app = express();

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

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB();
});