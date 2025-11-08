import React from 'react'
import ServerSetSidebar from '../components/ServerSetSidebar'
import {Route,Routes} from 'react-router-dom';
import ServerProfile from '../components/SettingCompo/ServerProfile';
import Members from '../components/SettingCompo/Members';
import Roles from '../components/SettingCompo/Roles';


const ServerSetting = () => {
  return (
    <div className="h-screen flex flex-col">
        <div className="flex flex-1 overflow-hidden">
            <ServerSetSidebar/>
            <main className='flex-1 overflow-y-auto'>
            <Routes>
                <Route path="/Profile" element= {<ServerProfile/>} />
                <Route path="/Members" element={<Members/>}/>
                <Route path='/Roles' element={<Roles/>}/>
            </Routes>
            </main>
        </div>
    </div>
  )
}

export default ServerSetting