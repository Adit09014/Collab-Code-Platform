import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';


export const useChannelStore= create((set,get)=>({
    channels:[],
    name:null,
    server:null,



    getChannels: async (categoryId) =>{
        try{
            const res= await axiosInstance.get(`/channel/getchannel/${categoryId}`);
            set({channels:res.data});
            toast.success("Fetched the channel");
        }
        catch(err){
            toast.error(err.response?.data?.message || "Something went wrong");

        }
    },

    addChannel: async(categoryId,data)=>{
        try{
            const res= await axiosInstance.post(`/channel/addChannel/${categoryId}`,data);
            set(state => ({ channels: [...state.channels, res.data] }));
            toast.success("Added Channel Succesfully.");
        }
        catch(err){
            toast.error(err.response?.data?.message || "Something went wrong");

        }
    }
}))