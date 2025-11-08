import React from 'react'
import { useServerStore } from '../../store/useServerStore'

const Members = () => {
 const { ActiveServer } = useServerStore()

 console.log("ActiveServer:", ActiveServer)

 return (
  <div className='h-screen pt-20'>
   <div className='max-w-2xl mx-auto p-4 py-8'>
    <div className='bg-base-300 rounded-xl p-6 py-8'>
     <div className='text-center'>
      <h2 className='text-xl font-semibold mb-4'>Members</h2>

      {ActiveServer?.members?.length > 0 ? (
       ActiveServer.members.map((mem) => (
        <div
         key={mem._id}
         className='flex items-center justify-between bg-base-200 p-3 mb-2 rounded-lg'
        >
         <span className='font-medium'>{mem.user?.fullName || "Unknown"}</span>
         <span className='text-sm text-gray-400'>
          {mem.roles?.map((r) => r.name).join(", ") || "Member"}
         </span>
        </div>
       ))
      ) : (
       <p className='text-gray-400'>No members yet</p>
      )}
     </div>
    </div>
   </div>
  </div>
 )
}

export default Members
