import React from 'react'
import { useGroupChatStore } from '../store/useGroupChatStore'

const CodeProjectSidebar = () => {
    const {selectedChannel} = useGroupChatStore(); 
    return (
    <div className='flex h-screen'>
        <div className='w-50 bg-gray-800 flex flex-col items-center py-3 space-y-2 overflow-auto border-4 border-gray-700'>
            <div>
                <p>{selectedChannel ? selectedChannel.name : "Please Select a Channel"}</p>
            </div>
        </div>
    </div>
    )
}

export default CodeProjectSidebar