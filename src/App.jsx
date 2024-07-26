import React, { useEffect, useState } from 'react'
import './App.css'
import {useDispatch} from 'react-redux'
import authService from './appwrite/auth'
import {login, logout} from './slice/authSlice'
import {Header} from './components/Index'
import {Outlet} from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
      authService.getCurrentUser()
      .then((userData) => {
        if(userData){
          dispatch(login({userData}));
    
        }
        else dispatch(logout());
      })
      .finally(() => setLoading(false))
  },[])

  return !loading ? ( // if not loading
    <div className=' min-h-screen flex flex-col content-between bg-orange-100'>
      <div className='w-full block'>
        <Header/>
        <main><Outlet/></main>
      </div>
    </div>
  ) : null
}

export default App
