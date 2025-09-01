import React from 'react'
import Navbar from './components/Navbar';
import {Navigate, Route,Routes} from 'react-router-dom';
import Signuppage from './scenes/Signuppage';
import HomePage from './scenes/Homepage';
import LoginPage from './scenes/Loginpage';
import ProfilePage from './scenes/ProfilePage';

import { useAuthStore } from './store/useAuthStore';
import { useEffect}  from 'react';
import { Loader } from 'lucide-react';
import {Toaster} from 'react-hot-toast';
import Sidebar from './components/Sidebar';


const App = () => {

  const {authUser,checkAuth,isCheckingAuth} = useAuthStore();

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
    <div>
      
      <Navbar/>
      {authUser && <Sidebar/>}
      <Routes>
        <Route path="/" element= {authUser?  <HomePage/>: <Navigate to="/login"/>} />
        <Route path="/signup" element= {!authUser ? <Signuppage/> : <Navigate to="/"/>} />
        <Route path="/login" element= {!authUser ? <LoginPage/> : <Navigate to="/"/> } />
        <Route path="/profile" element= {<ProfilePage/>} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App