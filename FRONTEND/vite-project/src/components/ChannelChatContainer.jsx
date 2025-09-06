import React from 'react'
import { useChatStore } from "../store/useChatStore.js";
import { useEffect, useRef } from "react";
import {useAuthStore} from '../store/useAuthStore.js';
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import {formatMessageTime} from '../lib/timeFormat.js';
import { useGroupChatStore } from '../store/useGroupChatStore.js';

const ChannelChatContainer = () => {
    const {messages,channelUsers,selectedChannel,isUserLoading,isMessagesLoading,getChannelMessages,initChannelListeners,leaveChannel}= useGroupChatStore();
    const {authUser} = useAuthStore();    
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (!selectedChannel) return;
        getChannelMessages(selectedChannel._id);
        initChannelListeners(selectedChannel._id);

        return ()=> leaveChannel(selectedChannel._id);

    }, [selectedChannel._id]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, [messages]);

    return(
        <div className="flex-1 flex flex-col overflow-auto">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <h2 className="text-2xl font-bold text-center my-4">
                    Welcome to {selectedChannel.name}
                </h2>

                {messages.map((message)=>(
                    <div
                        key={message._id}
                        className={`chat ${message.senderId?._id === authUser._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderId?._id === authUser._id
                                        ? authUser.profilePic || "/avatar.jpg"
                                        : message.senderId?.profilePic || "/avatar.jpg"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <span>{message.senderId?.fullName}</span>
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img
                                src={message.image}
                                alt="Attachment"
                                className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>
            <MessageInput/>
        </div>
        
    );

}

export default ChannelChatContainer