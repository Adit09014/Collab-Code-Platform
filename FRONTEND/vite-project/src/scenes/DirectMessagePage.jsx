import React from 'react'
import NoChatSelected from '../components/NoChatSelected.jsx'
import ChatContainer from '../components/DMChatContainer.jsx'
import {useChatStore} from '../store/useChatStore.js';


const DirectMessagePage = () => {

  const {selectedUser} = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-15 ">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-4rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DirectMessagePage 