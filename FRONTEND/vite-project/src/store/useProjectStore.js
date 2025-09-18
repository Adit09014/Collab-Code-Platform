import {create} from 'zustand'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useProjectStore= create((set,get)=>({
    projects:{},

    getProject: async(folderId)=>{
        try{
            const res = await axiosInstance.get(`/project/getProject/${folderId}`);

            set(state => ({
                projects: {
                    ...state.projects,
                    [folderId]: res.data 
                }
            }));
            
            console.log("Fetched Projects:", folderId);
        }
        catch(err){
            toast.error(err.response?.data?.message || "Something went wrong fetching Projects");
        }
    },
    addProject: async(folderId,data)=>{
        try {
            const res = await axiosInstance.post(`/project/addProject/${folderId}`,data);
            set(state => ({
                projects: {
                    ...state.projects,
                    [folderId]: [
                        ...(state.projects[folderId] || []),
                        res.data
                    ]
                }
            }));
            
            toast.success("Added Project Successfully.");
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong adding Project");
        }
    }
}))