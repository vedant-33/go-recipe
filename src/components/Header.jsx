import React, {useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {LogoutBtn, Container} from './Index'
import authService from "../appwrite/auth";
import { setUser } from "../slice/authSlice";

function Header() {
    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch();
    const location= useLocation();

    useEffect(() => {
        const getUserData = async() => {
            const userData = await authService.getCurrentUser();
            if(userData) {
                dispatch(setUser(userData));
            }
        }
        if(authStatus) getUserData();
    }, [authStatus, dispatch]);

    const navItems = [
        {
            name: 'Home',
            slug: '/',
            active: true,
        },
        {
            name: 'Login',
            slug: '/login',
            active: !authStatus, //if not logged in, login btn would appear
        },
        {
            name: 'Signup',
            slug: '/signup',
            active: !authStatus,
        },
        {
            name: 'Recipe Of The Day!',
            slug: '/recipe-of-the-day',
            active: authStatus,
        },
        {
            name: 'Add Recipe',
            slug:'/add-post',
            active: authStatus,
        },
    ];
    const homePage = location.pathname === '/';

    return (
        <header className='py-3 shadow bg-violet-700'>
            <Container>
                <nav className='flex items-center'>
                    {user && <p className="mr-auto text-white">Hello, <span className="uppercase">{user.name}</span></p>}
                    {homePage && !authStatus && <p className="mr-auto bg-yellow-300 px-6 py-3 rounded-full shadow-lg font-bold text-center">Login to add recipes!</p>}
                    <ul className='flex ml-auto'>
                        {navItems.map((item) => 
                        item.active ? (
                            <li key={item.name}>
                                <button
                                className='inline-bock px-6 py-2 duration-200 hover:bg-orange-200 rounded-full text-red-400 font-bold'
                                onClick={() => navigate(item.slug)}
                                >{item.name}</button>
                            </li>
                        ) : null
                        )}
                        {authStatus && (
                            <li><LogoutBtn/></li> //only appears if authStatus is true
                        )}
                    </ul>
                </nav>
            </Container>
        </header>
    )
}

export default Header;