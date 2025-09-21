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
    addFolderToStructure: (folders, newFolder, parentFolderId) => {
        if (!parentFolderId) {
            // If no parent, add to root level
            return [...folders, { ...newFolder, subfolders: [] }];
        }

        // Recursively find and add to parent folder
        return folders.map(folder => {
            if (folder._id === parentFolderId) {
                return {
                    ...folder,
                    subfolders: [
                        ...(folder.subfolders || []),
                        { ...newFolder, subfolders: [] }
                    ]
                };
            } else if (folder.subfolders && folder.subfolders.length > 0) {
                return {
                    ...folder,
                    subfolders: get().addFolderToStructure(folder.subfolders, newFolder, parentFolderId)
                };
            }
            return folder;
        });
    },
    
    addFolders: async(channelId,data)=>{
        try {
            const res = await axiosInstance.post(`/projectFolder/addFolder/${channelId}`,data);
            const newFolder = {
                _id: res.data.id, // Note: your backend returns 'id', not '_id'
                foldername: res.data.foldername,
                channel: res.data.channel,
                parentFolder: data.parentFolder || null
            };

            set(state => {
                const currentFolders = state.folders[channelId] || [];
                const updatedFolders = get().addFolderToStructure(
                    currentFolders, 
                    newFolder, 
                    data.parentFolder
                );

                return {
                    folders: {
                        ...state.folders,
                        [channelId]: updatedFolders
                    }
                };
            });
            
            toast.success("Added Folder Successfully.");
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong adding Folder");
        }
    }
}))