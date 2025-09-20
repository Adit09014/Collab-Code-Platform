import {create} from 'zustand'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import {useAuthStore} from "./useAuthStore.js"
 
export const useProjectStore= create((set,get)=>({
    projects:{},
    code: null,
    selectedFile:null,
    selectedLang:null,

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
    },
    getCode: async(fileId)=>{
        try{
            const res = await axiosInstance.get(`/project/getCode/${fileId}`);
            set({code:res.data.code});
            return res.data.code;
        }
        catch(err){
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong getting the code");
        }
    },
    changeCode: async(fileId,code)=>{
        try{
            await axiosInstance.put(`/project/codeChange/${fileId}`,{code});

            set(state => ({
                code: { ...state.code, [fileId]: code }
            }));

        }
        catch(err){
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong changing the code");
        }
    },

    setSelectedFile: (selectedFile)=> set({selectedFile}),
    setSelectedLang: (selectedLang)=> set({selectedLang}),
}))