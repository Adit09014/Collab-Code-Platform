import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useChannelStore = create((set, get) => ({
    channels: {}, 
    name: null,
    server: null,

    getChannels: async (categoryId) => {
        try {
            const res = await axiosInstance.get(`/channel/getchannel/${categoryId}`);
            
            
            set(state => ({
                channels: {
                    ...state.channels,
                    [categoryId]: res.data 
                }
            }));
            
            console.log("Fetched channels for category:", categoryId);
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong fetching channels");
        }
    },

    addChannel: async (categoryId, data) => {
        try {
            const res = await axiosInstance.post(`/channel/addchannel/${categoryId}`,data);
            set(state => ({
                channels: {
                    ...state.channels,
                    [categoryId]: [
                        ...(state.channels[categoryId] || []),
                        res.data
                    ]
                }
            }));
            
            toast.success("Added Channel Successfully.");
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong adding channel");
        }
    },

    
    clearChannels: () => {
        set({ channels: {} });
    },

    
    getChannelsForCategory: (categoryId) => {
        const state = get();
        return state.channels[categoryId] || [];
    }
}));