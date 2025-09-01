import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';


export const useChannelStore= create((set,get)=>({
    channel:[],
    name:null,
    server:null,



    getChannels: async (serverId) =>{
        try{
            const res= await axiosInstance.get(`/channel/getchannel/${serverId}`);
            set({channel:res.data});
            toast.success("Fetched the channel");
        }
        catch(err){
            toast.error(err.response?.data?.message || "Something went wrong");

        }
    },

    addChannel: async(data)=>{
        try{
            const res= await axiosInstance.post("/channel/addChannel",data);
            set({channel: res.data});
            toast.success("Added Channel Succesfully.");
        }
        catch(err){
            toast.error(err.response?.data?.message || "Something went wrong");

        }
    }
}))