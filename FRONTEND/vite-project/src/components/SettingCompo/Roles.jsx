import React from 'react'
import { useServerStore } from '../../store/useServerStore'
import { useState } from 'react'

const Roles = () => {
  const { ActiveServer,addRole} = useServerStore()
  const [roleModal,setRoleModal] =useState(false);
  const [roleName, setRoleName] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState([])
  
  
   const permissionsList = [
        "read",
        "write",
        "manage_messages",
        "manage_roles",
        "manage_server",
        "kick_members",
        "ban_members",
        "invite_members"
    ]
    const handlePermissionChange = (perm) => {
      setSelectedPermissions((prev) =>
        prev.includes(perm)
          ? prev.filter((p) => p !== perm)  
          : [...prev, perm]
      );
    };

    

  const handleSave = async () => {
    if (!ActiveServer?._id) {
      console.error('No active server selected')
      return
    }
    if (!roleName.trim()) {
      
      console.error('Role name is required')
      return
    }

    

    const data = {
      name: roleName.trim(),
      permissions: selectedPermissions
    }

    try {
      
      await addRole(ActiveServer._id,data)

      
      setRoleName('')
      setSelectedPermissions([])
      setRoleModal(false)
    } catch (err) {
      console.error('Failed to add role', err)
    }
  }

  
   return (
    <div className='h-screen pt-20'>
     <div className='max-w-2xl mx-auto p-4 py-8'>
      <div className='bg-base-300 rounded-xl p-6 py-8'>
       <div className='text-center'>
        <h2 className='text-xl font-semibold mb-4'>Server Roles</h2>
  
        {ActiveServer?.roles?.length > 0 ? (
         ActiveServer.roles.map((role) => (
          <div
           key={role._id}
           className='flex items-center justify-between bg-base-200 p-3 mb-2 rounded-lg'
          >
           <span className='font-medium '>{role?.name || "Unknown"}</span>
          </div>    
         ))
        ) : (
         <p className='text-gray-400'>No roles yet</p>
        )}
       </div>
       <div className='flex items-center justify-center'>
       <button className='bg-cyan-600 rounded-md p-2 ' onClick={()=>setRoleModal(true)}>
        Add Roles
       </button>
       </div>
      </div>
     </div>
     {roleModal && (
    <div className='fixed inset-0 bg-opacity-50 flex justify-center items-center z-50'>
     <div className='bg-base-200 p-6 rounded-lg w-96'>
      <h3 className='text-lg font-semibold mb-3'>Create New Role</h3>

      <input
       type='text'
       placeholder='Role Name'
       value={roleName}
       onChange={(e) => setRoleName(e.target.value)}
       className='w-full p-2 mb-4 border rounded-md bg-base-100'
      />

      <div className='mb-4'>
       <h4 className='font-medium mb-2'>Select Permissions</h4>
       <div className='grid grid-cols-2 gap-2'>
        {permissionsList.map((perm) => (
         <label
          key={perm}
          className='flex items-center space-x-2 text-sm'
         >
          <input
           type='checkbox'
           checked={selectedPermissions.includes(perm)}
           onChange={() => handlePermissionChange(perm)}
          />
          <span>{perm}</span>
         </label>
        ))}
       </div>
      </div>

      <div className='flex justify-end space-x-3'>
       <button
        className='bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600'
        onClick={() => setRoleModal(false)}
       >
        Cancel
       </button>
       <button
        className='bg-cyan-600 text-white px-3 py-1 rounded-md hover:bg-cyan-700'
        onClick={handleSave}
       >
        Save
       </button>
      </div>
     </div>
    </div>
   )}
    </div>
   )

   
}

export default Roles