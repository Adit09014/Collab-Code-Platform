import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingUp: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async()=>{
        try {
            const res= await axiosInstance.get("/auth/check");

            set({authUser: res.data});
        } 
        catch(err) {
            console.log("Error in checkAuth:",err.message);
            set({authUser: null});
        }
        finally{
            set({isCheckingAuth: false});
        }
    },

    signup: async(data)=>{
        set({isSigningUp:true});
        try{
            const res= await axiosInstance.post("/auth/signup",data,{withCredentials:true});
            set({authUser: res.data});
            toast.success("Account created successfully.")
        }   
        catch(err){
            toast.error(err.response.data.message);
        }
        finally{
            set({isSigningUp:false});
        }
    },
    logout: async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully.");
        }
        catch(err){
            toast.error(err.response.data.message);
        }
    },
    login: async (data) => {
        try {
            set({ isLoggingUp: true });

            const res = await axiosInstance.post("/auth/login", data, { withCredentials: true });

            if (res && res.data) {
                set({ authUser: res.data });
                toast.success("Logged in successfully");
            } else {
                throw new Error("No response from server");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Login failed";
            toast.error(errorMsg);
            console.error("Login error:", errorMsg);
        } finally {
            set({ isLoggingUp: false });
        }
    }
,

    updateProfile: async(data)=>{
        
        try{ 
            set({isUpdatingProfile: true})
            const res=await axiosInstance.put("/auth/update-profile",data);
            set({authUser: res.data});
            toast.success("Profile Pic Succesfully Updated.")
        }
        catch(err){
            toast.error(err.response?.data?.message || "error");
        }   
        finally{
            set({isUpdatingProfile:false})
        }
    }
}))