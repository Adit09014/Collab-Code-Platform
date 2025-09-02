import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useCategoryStore = create((set)=>({

    categories:[],
    name: null,
    server:null,

    getCategory: async (serverId)=>{
        try{
            const res=await axiosInstance.get(`/category/getCategory/${serverId}`);
            set({categories: res.data});
            toast.success("Fetched Category Succesfully.");
        }   
        catch(err){
            console.log("Error in getCategory",err.message);
        }
    },

    addCategory: async (serverId,data)=>{
        try{
            const res = await axiosInstance.post(`/category/addCategory/${serverId}`,data);
            set(state => ({ categories: [...state.categories, res.data] }));
            toast.success("Added Succesfully.")
        }
        catch(err){
            console.log("Error in addCategory",err.message);
        }
    }
}))
