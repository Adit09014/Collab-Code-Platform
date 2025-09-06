import React,{useState} from 'react';
import { Hash, Volume2, Plus, Settings, Mic, MicOff, Headphones, PlusIcon, ChevronDown, ChevronsUpDown, Users, LogOut } from 'lucide-react';
import {useAuthStore} from '../store/useAuthStore.js';
import {useServerStore} from '../store/useServerStore.js' 
import { useEffect,useRef    } from 'react';
import { useChannelStore } from '../store/useChannelStore.js';
import {useCategoryStore} from '../store/useCategoryStore.js';
import {useChatStore} from '../store/useChatStore.js';
import { Link, useNavigate,useLocation } from "react-router-dom";
import { useGroupChatStore } from '../store/useGroupChatStore.js';

const Sidebar=()=>{
    const [newServerName,setNewServerName]= useState('');
    const [newServerDesc,setNewServerDesc]=useState('');
    const {servers, getServers,addServer} = useServerStore();
    const [addServerModal,setAddServerModal]=useState(false);
    const {channels,getChannels,addChannel} = useChannelStore();
    const [activeServer,setActiveServer]=useState(null);
    const [activeCategory,setActiveCategory]=useState(null);
    const {categories,getCategory,addCategory}= useCategoryStore();
    const [activeChannel, setActiveChannel] = useState(null);
    const [addChannelModal, setAddChannelModal] = useState(false);
    const [newChannelName, setNewChannelName]= useState('');
    const [newChannelType, setNewChannelType]= useState('text');
    const [openServerMenu, setOpenServerMenu] = useState(false);
    const [newCategoryName,setNewCategoryName]=useState('');
    const [addCategoryModal, setAddCategoryModal]=useState(false);
    const [openDM,setOpenDM]= useState(false);
    const {friends,selectedUser,isUserLoading,getUsers,setSelectedUser}=useChatStore();
    const {selectedChannel, setSelectedChannel} = useGroupChatStore();

    const{onlineUsers}= useAuthStore();

    const location= useLocation();
    const isOnDirectMessage= location.pathname ==='/DirectMessage';

    useEffect(()=>{
        getServers()
    },[]);

    

    useEffect(()=>{
        setOpenDM(isOnDirectMessage);
        if(isOnDirectMessage){
            setActiveServer(null);
            setActiveCategory(null);
            setActiveChannel(null);
            setSelectedChannel(null)
            getUsers();
        }
    },[isOnDirectMessage]);

    const menuRef = useRef(null);
    useEffect(() => {
        if (activeServer?._id) {
            getCategory(activeServer._id)
        }
    }, [activeServer]);

    useEffect(() => {
        categories?.forEach(cat => {
        getChannels(cat._id); 
        });
    }, [categories]);


    useEffect(() => {
        const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setOpenServerMenu(false);
        }
        };

        if (openServerMenu) {
        document.addEventListener("mousedown", handleClickOutside);
        } else {
        document.removeEventListener("mousedown", handleClickOutside);
        }

        
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openServerMenu]);

    const handleAddServer= async ()=>{
        if(newServerName.trim() && newServerDesc.trim()){
            await addServer({
                name: newServerName,
                description: newServerDesc
            });
            await getServers();
            setNewServerName('');
            setNewServerDesc('');
        }
        setAddServerModal(false);
    }

    const handleAddChannel = async()=>{
        if(newChannelName.trim() && activeCategory?._id){
            await addChannel(activeCategory._id,{
                name: newChannelName,
                type: newChannelType,
            });
        }

        await console.log(newChannelName);
        await console.log(newChannelType);
        setNewChannelName('');
        setNewChannelType('');
        setAddChannelModal(false);
    }

    const handleAddCategory= async()=>{
        if(newCategoryName.trim() && activeServer?._id){
            await addCategory(activeServer._id,{
                name: newCategoryName
            });
        }
        setNewCategoryName('');
        setAddCategoryModal(false);
    }

    const handleServerSwitch=(server)=>{
        setActiveServer(server);
        setActiveCategory(null);
        setActiveChannel(null);
        setSelectedChannel(null);
        setOpenDM(false);
        
        if(isOnDirectMessage){
            navigate('/');
        }
    }

    const handleChannelSwitch= (channel)=>{
        setActiveChannel(channel);
        setSelectedChannel(channel);
    }

    const CategoryHeader = ({ category }) => (
        <div className="flex items-center justify-between px-2 py-2 mx-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {category.name}
        </span>
        <Plus
            className="w-4 h-4 text-gray-400 hover:text-gray-200 cursor-pointer" onClick={()=>{setActiveCategory(category) 
                setAddChannelModal(true)}}
        />
        </div>
    );

    const ChannelItem = ({ channel, activeChannel, onClick }) => {
        const isActive = activeChannel?._id === channel?._id

        return (
            <div
            onClick={onClick}
            className={`flex items-center px-2 py-1.5 mx-2 rounded cursor-pointer transition-colors group 
                ${isActive ? "bg-gray-600 text-white" : " text-white hover:bg-gray-500"}`}
            >
            {channel.type === "text" ? (
                <Hash className="w-4 h-4 mr-2" />
            ) : (
                <Volume2 className="w-4 h-4 mr-2" />
            )}
            <span className="text-sm truncate">{channel.name}</span>
            </div>
        )
    }

    const ServerHeader= ({server})=>{
        return(
            <div className="flex items-center justify-between px-1 py-1 mx-2 ">
                <span className="text-white font-bold  text-xl group-hover:text-gray-100">
                    {server?.name || navigate('/DirectMessage')}
                </span>

                <ChevronsUpDown className="w-4 h-4 text-gray-400 hover:text-gray-200 cursor-pointer" onClick={() => setOpenServerMenu(prev => !prev)}/>
            </div>
        )
    }

    const navigate = useNavigate();

    const handleDM = () => {
        setActiveServer(null);
        setActiveCategory(null);
        setActiveChannel(null);
        setSelectedChannel(null);
        setOpenDM(true);
        navigate("/DirectMessage");
    };


    const menuItems = [
    { icon: Plus ,label: 'Add Category', action:  ()=>setAddCategoryModal(true) },
    { icon: Settings, label: 'Settings', action: () => console.log('Settings clicked') },
    { icon: Users, label: 'Invite Friends', action: () => console.log('Invite clicked') },
    { icon: LogOut, label: 'Leave Server', action: () => console.log('Leaving Server') },
  ];

  


    return(
        <div className='flex h-screen'>
            <div className='w-16 bg-gray-900 flex flex-col items-center py-3 space-y-2 overflow-auto'>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors mt-15 overflow-auto">
                    <button onClick={handleDM} >
                        <span className="text-white font-bold">DM</span>
                    </button>

                </div>
                {servers.map(server=>(
                    <div 
                        key={server._id}
                        onClick={()=>handleServerSwitch(server)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all hover:rounded-xl ${
                        activeServer?._id === server?._id
                            ? 'bg-blue-600 rounded-xl'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        >
                    <span className="text-white font-semibold text-sm">{server.name}</span>
                    </div>
                ))}
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors group">
                    <PlusIcon className="w-6 h-6 text-gray-300 group-hover:text-white" onClick={()=>setAddServerModal(true)}/>
                </div>
            </div>
            {addServerModal && (
                <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-700 p-6 rounded-lg w-96">
                        <h3 className='text-lg font-semibold mb-4 text-white'>Create a New Server</h3>
                        <div className='mb-4'>
                            <label className='block item-sm font-medium mb-2 text-white'>Server Name</label>
                            <input type='text' value={newServerName} onChange={(e)=> setNewServerName(e.target.value)}
                             className="w-full p-2 bg-gray-600 rounded border border-gray-500 text-white" placeholder='Enter the Server Name' />
                        </div>
                        <div className='mb-4'>
                            <label className='block item-sm font-medium mb-2 text-white'>Description</label>
                            <textarea value={newServerDesc} onChange={(e)=> setNewServerDesc(e.target.value)}
                            className="w-full p-2 bg-gray-600 rounded border border-gray-500 text-white" placeholder='Enter the Server Description'/>
                        </div>
                        <div className='flex justify-end space-x-3'>
                            <button onClick={()=>setAddServerModal(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors">
                                Cancel
                            </button>

                            <button onClick={handleAddServer} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors">
                                Create Server
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {!openDM && (
                <div className="w-64 bg-gray-800 text-white flex flex-col mt-15">
                    <div className='p-4 border-b border-gray-700'>
                        <ServerHeader server={activeServer}/>
                    </div>
                    {openServerMenu && (
                    <div ref={menuRef} className="absolute left-70  mt-15 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {menuItems.map((item, index) => {
                            const Icon= item.icon;
                        return (
                            <button
                            key={index}
                            onClick={() => {
                                item.action();
                                setOpenServerMenu(false);
                            }}
                            className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                            >
                            <Icon className="w-4 h-4 mr-3 text-gray-500 group-hover:text-gray-700" />
                            <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        );
                        })}
                    </div>
                    )}
                    <div className="flex-1 overflow-y-auto pt-2">
                    {categories?.map(cat=>(
                        <div key={cat._id} >
                                <CategoryHeader category ={cat}/>
                                {channels[cat._id]?.map(ch=>(
                                        <ChannelItem key={ch._id} channel={ch} activeChannel={activeChannel} onClick={() => handleChannelSwitch(ch)}/>
                                ))}
                        </div>
                    ))}
                </div>
            {addChannelModal && (
                <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-700 p-6 rounded-lg w-96">
                        <h3 className='text-lg font-semibold mb-4 text-white'>Create a New Channel</h3>
                        <div className='mb-4'>
                            <label className='block item-sm font-medium mb-2 text-white'>Channel Name</label>
                            <input type='text' value={newChannelName} onChange={(e)=> setNewChannelName(e.target.value)}
                             className="w-full p-2 bg-gray-600 rounded border border-gray-500 text-white" placeholder='Enter the Chanel Name' />
                        </div>
                         <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-white">
                                Type
                            </label>
                            <select
                                value={newChannelType}
                                onChange={(e) => setNewChannelType(e.target.value)}
                                className="w-full p-2 bg-gray-600 rounded border border-gray-500 text-white"
                            >
                                <option value="text">Text</option>
                                <option value="voice">Voice</option>
                            </select>
                        </div>
                        <div className='flex justify-end space-x-3'>
                            <button onClick={()=>setAddChannelModal(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors">
                                Cancel
                            </button>

                            <button onClick={handleAddChannel} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors">
                                Create Channel 
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {addCategoryModal && (
                <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-700 p-6 rounded-lg w-96">
                        <h3 className='text-lg font-semibold mb-4 text-white'>Create a New Category</h3>
                        <div className='mb-4'>
                            <label className='block item-sm font-medium mb-2 text-white'>Category Name</label>
                            <input type='text' value={newCategoryName} onChange={(e)=> setNewCategoryName(e.target.value)}
                             className="w-full p-2 bg-gray-600 rounded border border-gray-500 text-white" placeholder='Enter the Category Name' />
                        </div>
                         
                        <div className='flex justify-end space-x-3'>
                            <button onClick={()=>setAddCategoryModal(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors">
                                Cancel
                            </button>

                            <button onClick={handleAddCategory} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors">
                                Create Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
            )}
            {openDM && (
                <div className="w-85 bg-gray-800 text-white flex flex-col mt-15">
                    <div className="border-b border-base-300 w-full p-5">
                        <div className="flex items-center gap-2">
                            <Users className="size-6" />
                        <span className="font-medium hidden lg:block">FRIENDS</span>
                        </div>
                    </div>
                    <div className='overflow-y-auto w-full py-3'>
                        {friends.map((user)=>(
                            <button key={user._id} onClick={()=> setSelectedUser(user)} 
                                className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}>
                                    <div className='flex flex-row items-center gap-3'>
                                        <div className='relative'>
                                        <img
                                            src={user.profilePic || "/avatar.jpg"}
                                            alt={user.name}
                                            className="size-12 object-cover rounded-full"
                                        />
                                        {onlineUsers.includes(user._id) && (
                                            <span
                                                className="absolute bottom-0 right-0 size-3 bg-green-500 
                                                rounded-full ring-2 ring-zinc-900"
                                            />
                                        )}
                                        </div>  
                                        <div className="hidden lg:block text-left min-w-0">
                                            <div className="font-medium truncate">{user.fullName}</div>
                                            <div className="text-sm text-zinc-400">
                                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                            </div>
                                        </div>
                                    </div>
                            </button>     
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sidebar;