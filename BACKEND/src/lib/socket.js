import {Server} from "socket.io"
import http from "http"
import express from "express"

const app = express();
const server= http.createServer(app);


const io= new Server(server,{
    cors:{
        origin: ["http://localhost:5173"],
    },
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

const userSocketMap = {};
const userChannels={};

io.on("connection",(socket)=>{
    console.log("A user connected",socket.id);

    const userId= socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]= socket.id
        userChannels[userId]= new Set();
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("joinChannel", (channelId) => {
        if (userId && channelId) {
            socket.join(`channel_${channelId}`);
            userChannels[userId].add(channelId);
            console.log(`User ${userId} joined channel ${channelId}`);
        }
    });

    socket.on("leaveChannel", (channelId) => {
        if (userId && channelId) {
            socket.leave(`channel_${channelId}`);
            userChannels[userId].delete(channelId);
            console.log(`User ${userId} left channel ${channelId}`);
        }
    });

    socket.on("disconnect",()=>{
        console.log("A user disconnect",socket.id);
        if (userId && userChannels[userId]) {
            userChannels[userId].forEach(channelId => {
                socket.leave(`channel_${channelId}`);
            });
            delete userChannels[userId];
        }
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
});

export function emitToChannel(channelId, event, data) {
    io.to(`channel_${channelId}`).emit(event, data);
}


export {io,app,server};