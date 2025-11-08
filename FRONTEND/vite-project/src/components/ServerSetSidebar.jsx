import React, { useState } from 'react'
import { useServerStore } from '../store/useServerStore'
import { useNavigate} from "react-router-dom";



const ServerSetSidebar = () => {
    const navigate= useNavigate();
    const {ActiveServer} = useServerStore();
    const [selectedItem,setSelectedItem] = useState(null);
    

    const menuItems = [
        {label:"Server Profile",action:()=> navigate("/ServerSetting/Profile")},
        {label:"Members",action:()=> navigate("/ServerSetting/Members")},
        {label:"Roles",action:()=> navigate("/ServerSetting/Roles")},
        {label:"Invites",action:()=> navigate("/ServerSetting/Invites")},
        {label:"Delete Server",action:()=> navigate("/ServerSetting/Delete")}
    ]
    

  return (
    <div className='flex h-screen'>
        <div className="w-80 bg-gray-800 text-white flex flex-col mt-16">
            <span className="px-6 py-4 text-lg font-semibold bg-gray-700/50 rounded-lg text-white tracking-wide">{ActiveServer?.name}</span>
            {menuItems.map((item, index) => {
                        return (
                            <button
                            key={index}
                            className={`w-full flex items-center px-6 py-4 text-left ${selectedItem===item.label?  "bg-gray-700/50 rounded-lg text-white" : "text-2xl-gray-300 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-150 group"}`}
                            onClick={()=>{setSelectedItem(item.label)
                                item.action()
                                }
                            }
                            >
                            <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        );
            }
            )}
        </div>
    </div>
  )
}

export default ServerSetSidebar