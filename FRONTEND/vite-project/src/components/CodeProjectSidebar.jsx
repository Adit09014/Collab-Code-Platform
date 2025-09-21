import React, { useState ,useRef,useEffect} from 'react'
import { useGroupChatStore } from '../store/useGroupChatStore.js'
import { ChevronDown, ChevronRight, ChevronsUpDown ,Plus, Trash,} from 'lucide-react';
import {useFolderStore} from "../store/useProjectFolderStore.js"
import { useProjectStore } from '../store/useProjectStore.js';



const CodeProjectSidebar = () => {
    const {folders,addFolders,getFolders} = useFolderStore();
    const {projects,addProject,getProject,setSelectedFile,setSelectedLang} = useProjectStore();
    const [addFolderModal,setAddFolderModal] = useState(false);
    const [newFolderName,setNewFolderName] = useState("");
    const [openServerMenu,setOpenServerMenu] = useState(false);
    const [openFolder,setOpenFolder] = useState(false);
    const [newProjectName,setNewProjectName] = useState("");
    const [newProjectLanguage,setNewProjectLanguage] = useState("");
    const [addProjectModal,setAddProjectModal] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [activeFile,setActiveFile] = useState(null);
    const [optionModal,setOptionModal] = useState(null);
    const [addNestedModal,setAddNestedModal] = useState(null);
    const [newNestedFolder,setNewNestedFolder] = useState("");

    const extensions = {
        python: ".py",
        javascript: ".js",
        typescript: ".ts",
        java: ".java",
        c: ".c",
        cpp: ".cpp",
        html: ".html",
        css: ".css",
    };

    const handleAddFolder = async()=>{
        if (!newFolderName.trim()) {
            toast.error("Folder name is required");
            return;
        }
        
        await addFolders(selectedChannel._id,{
            foldername: newFolderName
        });
        
        setAddFolderModal(false);
        setNewFolderName("");
    }

    const handleNestedFolder = async(folderId)=>{
        if (!newNestedFolder.trim()) {
            toast.error("Folder name is required");
            return;
        }
        
        await addFolders(selectedChannel._id,{
            foldername: newNestedFolder,
            parentFolder: folderId
        });
        
        setAddNestedModal(false);
        setNewNestedFolder("");
    }

    const handleaddProject = async(folder)=>{
        if (!selectedFolder) {
            toast.error("No folder selected");
            return;
        }
        
        await addProject(folder._id,{
            name: newProjectName,
            language: newProjectLanguage
        });
        setAddProjectModal(false);
        setNewProjectName("");
        setNewProjectLanguage("");
    }


    const menuItems = [
        { icon: Plus ,label: 'Add Folder', action:  ()=>setAddFolderModal(true) },,
        { icon: Trash, label: 'Delete Server', action: () => console.log('Delete Folder') },
    ];
    const {selectedChannel} = useGroupChatStore(); 
    const menuRef = useRef(null);
    useEffect(() => {
        if (selectedChannel?._id) {
            getFolders(selectedChannel._id)
        }
    }, [selectedChannel]);

    useEffect(()=>{
        if(activeFile?._id){
            setSelectedFile(activeFile._id);
            setSelectedLang(activeFile.language);
        }
    },[activeFile]);

    useEffect(() => {
        if (selectedChannel?._id) {
            getFolders(selectedChannel._id)
        }
    }, [selectedChannel]);
    

    const toggle = async (folderId)=>{
        setOpenFolder(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }))

        if(!openFolder[folderId]){
            await getProject(folderId);
        }
    }

    const FolderHeader = ({ folder }) => (
        <>
        <div
            className="flex items-center justify-between px-2 py-2 mx-2 cursor-pointer hover:bg-gray-700 rounded overflow-auto"
            onClick={() => toggle(folder._id)}
        >
            <div className="flex items-center">
            {openFolder[folder._id] ? (
                <ChevronDown className="w-4 h-4 text-gray-400 mr-2" />
            ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
            )}
            <span className="text-xs font-semibold text-gray-400 tracking-wide">
                {folder.foldername}
            </span>
            </div>
            <Plus className="w-3 h-3 text-gray-400" onClick={(e) => {
                e.stopPropagation(); 
                setSelectedFolder(folder);
                setOptionModal(true);
            }}/>
            </div>
            <div className='mx-7 border-l'>
            {openFolder[folder._id] && folder.subfolders?.map((sub, index) => (
                <FolderHeader key={sub._id || `sub-${index}`} folder={sub} />
            ))}


            {openFolder[folder._id] && (
                <div className="ml-6 mt-2 flex flex-col space-y-1">

                    {projects?.[folder._id]?.length > 0 ? (
                    projects[folder._id].map((project) => (
                        <div
                            key={project._id}
                            className={`px-2 py-1 text-xs ${(project._id === activeFile)?"bg-gray-600 text-white" : " text-white hover:bg-gray-500"}`}
                            onClick={()=>{setActiveFile(project._id) 
                                setSelectedFile(project._id)
                                setSelectedLang(project.language);
                            }}
                        >
                            {project.filename}{extensions[project.language] || ""}
                        </div>
                    ))
                    ) : (
                    <span className="text-xs text-gray-500 italic">
                        No projects
                    </span>
                    )}
                </div>
            )}
        </div>
        </>
    );



    return (
        <>
        <div className='flex h-screen'>
            <div className='flex w-50 bg-gray-800 flex-col py-1 px-1 space-y-2 border-4 border-gray-700 h-screen'>
                <div className='flex justify-between items-center p-4.5 border-b border-gray-700 w-full '>
                    <p>{selectedChannel ? selectedChannel.name : "Please Select a Channel"}</p>
                    <ChevronsUpDown className="w-4 h-4 text-gray-400 hover:text-gray-200 cursor-pointer" onClick={()=>setOpenServerMenu(true)}/>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
                    <div className='space-y-1'>
                    {folders[selectedChannel?._id]?.map(folder=>(
                        <div key={folder._id} >
                                <FolderHeader folder ={folder}/>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
        {addFolderModal && (
                <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-700 p-6 rounded-lg w-96">
                        <h3 className='text-lg font-semibold mb-4 text-white'>Create a New Folder</h3>
                        <div className='mb-4'>
                            <label className='block item-sm font-medium mb-2 text-white'>Folder Name</label>
                            <input type='text' value={newFolderName} onChange={(e)=> setNewFolderName(e.target.value)}
                             className="w-full p-2 bg-gray-600 rounded border border-gray-500 text-white" placeholder='Enter the Folder Name' />
                        </div>
                    <button onClick={()=>setAddFolderModal(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors">
                        Cancle
                    </button>
                    <button onClick={handleAddFolder} className="px-4 py-2 mx-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors">
                        Create Folder
                    </button>
                    </div>
                </div>
        )}
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
        {optionModal &&(
            <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 bg-opacity-90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-96 border border-gray-600">
                <h3 className="text-xl font-bold mb-6 text-white text-center">
                Select an Option
                </h3>

                <div className="flex flex-col gap-4">
                <button
                    onClick={() => {
                        setAddProjectModal(true)
                        setOptionModal(false)
                    }}
                    className="w-full px-4 py-3 rounded-xl text-green-400 font-medium border border-green-500 
                    hover:bg-green-500 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                    Create File
                </button>

                <button
                    onClick={()=>{
                        setAddNestedModal(true)
                        setOptionModal(false)
                    }}
                    className="w-full px-4 py-3 rounded-xl text-blue-400 font-medium border border-blue-500
                    hover:bg-blue-500 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                    Create Folder
                </button>
                </div>

                <div className="mt-6 flex justify-center">
                <button
                    onClick={() => setOptionModal(false)}
                    className="text-gray-400 hover:text-red-400 text-sm transition-colors"
                >
                    Cancel
                </button>
                </div>
            </div>
            </div>
            )
        }
        {addProjectModal && (
            <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-700 p-6 rounded-lg w-96">
                <h3 className="text-lg font-semibold mb-4 text-white">
                    Create a New File in {selectedFolder?.foldername}
                </h3>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-white">
                    File Name
                    </label>
                    <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full p-2 bg-gray-600 rounded border border-gray-500 text-white"
                    placeholder="Enter the File Name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-white">
                    Language
                    </label>
                    <select
                    value={newProjectLanguage}
                    onChange={(e) => setNewProjectLanguage(e.target.value) }
                    className="w-full p-2 bg-gray-600 rounded border border-gray-500 text-white"
                    >
                    <option value="">Select Language</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="go">Go</option>
                    </select>
                </div>

                <div className="flex justify-end">
                    <button
                    onClick={() => setAddProjectModal(false)}
                    className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
                    >
                    Cancel
                    </button>
                    <button
                    onClick={()=>handleaddProject(selectedFolder)}
                    className="px-4 py-2 ml-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors"
                    >
                    Create File
                    </button>
                </div>
                </div>
            </div>
            )}
            {addNestedModal && (
                <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-700 p-6 rounded-lg w-96">
                        <h3 className='text-lg font-semibold mb-4 text-white'>Create a New Folder</h3>
                        <div className='mb-4'>
                            <label className='block item-sm font-medium mb-2 text-white'>Folder Name</label>
                            <input type='text' value={newNestedFolder} onChange={(e)=> setNewNestedFolder(e.target.value)}
                             className="w-full p-2 bg-gray-600 rounded border border-gray-500 text-white" placeholder='Enter the Folder Name' />
                        </div>
                    <button onClick={()=>setAddNestedModal(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors">
                        Cancle
                    </button>
                    <button onClick={()=>handleNestedFolder(selectedFolder._id)} className="px-4 py-2 mx-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors">
                        Create Folder
                    </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default CodeProjectSidebar