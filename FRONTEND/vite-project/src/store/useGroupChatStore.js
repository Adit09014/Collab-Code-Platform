import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useGroupChatStore= create((set,get)=>({
    messages:[],
    channelUsers:[],
    selectedChannel: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getChannelUsers: async(channelId)=>{
        set({isUserLoading:true});
        try {
            const res= await axiosInstance.get(`/channelmessage/user/${channelId}`);
            set({channelUsers: res.data});
            console.log("Successfully Fetched channel Users.");
        } 
        catch (err) {
            toast.error(err.response?.messages?.data || "Failed to fetch Users");
        }
        finally{
            set({isUserLoading: false});
        }
    },

    getChannelMessages: async(channelId)=>{
        set({isMessagesLoading: true});

        try{
            const res= await axiosInstance.get(`channelmessage/${channelId}`);
            set({messages:res.data});
            console.log("Successfully Fetched Channel Messages");
        }
        catch(err){
            toast.error(err.response?.messages?.data || "Failed to fetch channel messages");
        }
        finally{
            set({isMessagesLoading:false});
        }
    },

    sendChannelMessages: async(channelId,message)=>{
        try {
            const res = await axiosInstance.post(`/channelmessage/${channelId}`, message)
            console.log("Sent message in channel")
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send message")
        }
    },
    setSelectedChannel: (selectedChannel) => set({ selectedChannel }),

    initChannelListeners: (channelId) => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        
        socket.off("newChannelMessage");
        socket.off("channelUsersUpdated");
        
        socket.emit("joinChannel", channelId);
        socket.on("newChannelMessage", ({message}) => {
            set((state) => {
            const exists = state.messages.some((m) => m._id === message._id);
                if (exists) return state; 
                    return { messages: [...state.messages, message] };
            });
        });

        socket.on("channelUsersUpdated", (users) => {
            set({ channelUsers: users });
        });
    },

    leaveChannel: (channelId) => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.emit("leaveChannel", channelId);
        set({ messages: [], channelUsers: [] });
    },
}));

