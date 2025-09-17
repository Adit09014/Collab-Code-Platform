import {create} from 'zustand'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useFolderStore= create((set,get)=>({
    folders:{},

    getFolders: async(channelId)=>{
        try{
            const res = await axiosInstance.get(`/projectFolder/getFolder/${channelId}`);

            set(state => ({
                folders: {
                    ...state.folders,
                    [channelId]: res.data 
                }
            }));
            
            console.log("Fetched folders:", channelId);
        }
        catch(err){
            toast.error(err.response?.data?.message || "Something went wrong fetching folders");
        }
    },
    
    addFolders: async(channelId,data)=>{
        try {
            const res = await axiosInstance.post(`/projectFolder/addFolder/${channelId}`,data);
            set(state => ({
                folders: {
                    ...state.folders,
                    [channelId]: [
                        ...(state.folders[channelId] || []),
                        res.data
                    ]
                }
            }));
            
            toast.success("Added Folder Successfully.");
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong adding Folder");
        }
    }
}))