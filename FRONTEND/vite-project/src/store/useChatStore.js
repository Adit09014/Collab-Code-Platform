import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore= create((set,get)=>({
    messages:[],
    friends:[],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async()=>{
        set({isUserLoading:true});
        try {
            const res= await axiosInstance.get("/message/user");
            set({friends: res.data});
            console.log("Successfully Fetched User's friends.");
        } 
        catch (err) {
            toast.error(err.response?.messages?.data);
        }
        finally{
            set({isUserLoading: false});
        }
    },

    getMessages: async(userId)=>{
        set({isMessagesLoading: true});

        try{
            const res= await axiosInstance.get(`message/${userId}`);
            set({messages:res.data});
            console.log("Successfully Fetched Messages");
        }
        catch(err){
            toast.error(err.response?.messages?.data);
        }
        finally{
            set({isMessagesLoading:false});
        }
    },

    sendMessages: async(message)=>{
        const {selectedUser,messages}= get();
        if(!selectedUser){
            return;
        }
        try{
            const res= await axiosInstance.post(`message/${selectedUser._id}`,message);
            set({messages: [...messages,res.data]});
            console.log("Sent The Message Successfully");
        }
        catch(err){
            toast.error(err.response?.messages?.data || "Error in Sending Message");
        }
    },
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    listenToMessage:()=>{
        const {selectedUser}= get();
        if(!selectedUser){
            return;
        }

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            if(newMessage.senderId!==selectedUser._id){
                return;
            }
            set({
                messages:[...get().messages,newMessage],
            });
        });
    },

    shutoffMessage:()=>{
        const socket= useAuthStore.getState().socket;
        socket.off("newMessage");
    }
}));

