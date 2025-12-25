import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export const useVoiceStore = create((set) => ({
    token: null,
    joined: false,

    sendToken: async ({room,userId}) => {
        try {
            const res = await axiosInstance.get('/voice/callId',{
                params:{room,userId}
            })
            set({ token: res.data })
            toast.success("Successfully Joined the Voice Channel")
        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message || "Error Sending Tokens")
        }
    },
    
    leaveVoice:()=>
        set({
            token:null,
            joined:false
        })
    ,

    setJoin: (joined) => set({ joined })
}))
