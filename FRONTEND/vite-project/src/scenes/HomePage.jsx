import React from 'react'
import NoChatSelected from '../components/NoChatSelected.jsx'
import ChannelChatContainer from '../components/ChannelChatContainer.jsx'
import CodeProject from '../components/CodeProject.jsx'
import { useGroupChatStore } from '../store/useGroupChatStore.js'

const GroupMessagePage = () => {
  const { selectedChannel,server} = useGroupChatStore()

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-15">
        <div className="bg-base-100 rounded-lg shadow-cl w-full  h-[calc(100vh-4rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {!selectedChannel ? (
              <NoChatSelected />
            ) : selectedChannel.type === "code" ? (
              <CodeProject />
            ) : (
              <ChannelChatContainer />
            )}  
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupMessagePage
