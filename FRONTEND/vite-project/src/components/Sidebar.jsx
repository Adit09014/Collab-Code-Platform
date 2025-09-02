import React,{useState} from 'react';
import { Hash, Volume2, Plus, Settings, Mic, MicOff, Headphones, PlusIcon } from 'lucide-react';
import {useAuthStore} from '../store/useAuthStore.js';
import {useServerStore} from '../store/useServerStore.js' 
import { useEffect } from 'react';
import { useChannelStore } from '../store/useChannelStore.js';
import {useCategoryStore} from '../store/useCategoryStore.js';

const Sidebar=()=>{
    const [selectedServer,setSelectedServer]=useState(null);
    const [selectedChannel,setSelectedChannel]= useState(null);
    const [newServerName,setNewServerName]= useState('');
    const [newServerDesc,setNewServerDesc]=useState('');

    const {servers, getServers,addServer} = useServerStore();
    const [addServerModal,setAddServerModal]=useState(false);
    const {channels,getChannels,addChannel} = useChannelStore();
    const [activeServer,setActiveServer]=useState(null);
    const {categories,getCategory,addCategory}= useCategoryStore();


    useEffect(()=>{
        getServers()
    },[]);

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

    const handleServerSwitch=(server)=>{
        setActiveServer(server);
    }

    const CategoryHeader = ({ category }) => (
        <div className="flex items-center justify-between px-2 py-2 mx-2 mt-4">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {category}
        </span>
        <Plus
            className="w-4 h-4 text-gray-400 hover:text-gray-200 cursor-pointer"
        />
        </div>
    );

const ChannelItem = ({ channel }) => (
    <div
      className={'flex items-center px-2 py-1.5 mx-2 rounded cursor-pointer transition-colors group bg-gray-600 text-white'}
    >
      {channel.type === 'text' ? (
        <Hash className="w-4 h-4 mr-2" />
      ) : (
        <Volume2 className="w-4 h-4 mr-2" />
      )}
      <span className="text-sm truncate">{channel.name}</span>
    </div>
  );

    return(
        <div className='flex h-screen'>
            <div className='w-16 bg-gray-900 flex flex-col items-center py-3 space-y-2 overflow-auto'>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors mt-15 overflow-auto">
                    <span className="text-white font-bold">DM</span>
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
            <div className="w-64 bg-gray-800 text-white flex flex-col mt-15">
                <div className='p-4 border-b border-gray-700'>
                    <h2 className='text-lg font-semibold text-white'>{activeServer?.name || 'Direct Message'}</h2>
                </div>
                <div className="flex-1 overflow-y-auto pt-2">
                {categories?.map(cat=>(
                    <div key={cat._id} >
                            <CategoryHeader category ={cat.name}/>
                            {channels[cat._id]?.map(ch=>(
                                    <ChannelItem key={ch._id} channel={ch}/>
                            ))}
                    </div>
                ))}
            </div>
            </div>
            
        </div>
    )

    

}

export default Sidebar;