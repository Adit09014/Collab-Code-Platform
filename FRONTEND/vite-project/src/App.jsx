import React from 'react'
import Navbar from './components/Navbar';
import {Navigate, Route,Routes} from 'react-router-dom';
import Signuppage from './scenes/Signuppage';
import HomePage from './scenes/HomePage';
import LoginPage from './scenes/Loginpage';
import ProfilePage from './scenes/ProfilePage';

import { useAuthStore } from './store/useAuthStore';
import { useEffect}  from 'react';
import { Loader } from 'lucide-react';
import {Toaster} from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import DirectMessagePage from './scenes/DirectMessagePage';
import ServerSetting from './scenes/ServerSetting';
import { useServerStore } from './store/useServerStore';


const App = () => {

  const {authUser,checkAuth,isCheckingAuth} = useAuthStore();
  const {Setting} = useServerStore(); 

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  console.log({authUser})

  if(isCheckingAuth && !authUser){
    return(
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'/>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      
      <Navbar/>
      <div className="flex flex-1 overflow-hidden">
        {authUser && !Setting && <Sidebar/>}
        <main className='flex-1 overflow-y-auto'>
          <Routes>
            <Route path="/" element= {authUser?  <HomePage/>: <Navigate to="/login"/>} />
            <Route path="/DirectMessage" element= {authUser?  <DirectMessagePage/>: <Navigate to="/login"/>} />
            <Route path="/signup" element= {!authUser ? <Signuppage/> : <Navigate to="/"/>} />
            <Route path="/login" element= {!authUser ? <LoginPage/> : <Navigate to="/"/> } />
            <Route path="/profile" element= {<ProfilePage/>} />
            <Route path="/ServerSetting/*" element={<ServerSetting/>}/>
          </Routes>
        </main>
      </div>
        <Toaster/>
    </div>
  )
}

export default App