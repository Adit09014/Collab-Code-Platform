import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';


export const useServerStore = create((set, get) => ({

    servers: [],
    isServerLoading: false,
    isAddingServer: false,
    name: null,
    description: null,
    Setting:false,
    ActiveServer:null,

    getServers: async () => {
        set({ isServerLoading: true });
        try {
            const res = await axiosInstance.get("/server/getserver");
            set({ servers: res.data });
            toast.success("Fetched servers successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error fetching server1");
        } finally {
            set({ isServerLoading: false });
        }
    },

    addServer: async (data) => {
        set({ isAddingServer: true });
        try {
            const res = await axiosInstance.post('server/addserver', data);
            set({ servers: [...get().servers, res.data] });
            toast.success("Successfully added the server.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding server");
        } finally {
            set({ isAddingServer: false });
        }
    },

    setSettings: (Setting,ActiveServer)=> set({Setting,ActiveServer}),

}));
