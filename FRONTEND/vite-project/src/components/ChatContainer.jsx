import React from 'react'
import { useChatStore } from "../store/useChatStore.js";
import { useEffect, useRef } from "react";
import {useAuthStore} from '../store/useAuthStore.js';
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import {formatMessageTime} from '../lib/timeFormat.js';

const ChatContainer = () => {
    const {messages, getMessages,isMessageLoading, selectedUser,listenToMessage,shutoffMessage} = useChatStore();
    const {authUser} = useAuthStore();    
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (!selectedUser) return;
        getMessages(selectedUser._id);
        listenToMessage();

        return ()=>shutoffMessage();
    }, [selectedUser._id, getMessages,listenToMessage,shutoffMessage]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, [messages]);

    return(
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message)=>(
                    <div
                        key={message._id}
                        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderId === authUser._id
                                        ? authUser.profilePic || "/avatar.jpg"
                                        : selectedUser.profilePic || "/avatar.jpg"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
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

export default ChatContainer