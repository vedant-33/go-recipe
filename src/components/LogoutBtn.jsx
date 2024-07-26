import React from "react";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { logout } from "../slice/authSlice";

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () =>{
        authService.logout().then(() => { //deleteSessions
            dispatch(logout()); //change in store
        })
    }

    return (
        <button 
        className='inline-bock px-6 py-2 duration-200 hover:bg-white font-bold text-red-600 rounded-full'
        onClick={logoutHandler}
        >Logout</button>
    )
}

export default LogoutBtn;