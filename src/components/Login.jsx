import React, {useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import {login as authLogin} from '../slice/authSlice'
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import {Button,Input} from './Index'

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register, handleSubmit} = useForm();
    const [error, setError] = useState('');

    const login = async(data) => {
        setError('');
        try {
            const session = await authService.login(data);
            if(session){
                const userData= await authService.getCurrentUser()
                if(userData){
                    dispatch(authLogin(userData))
                }
                navigate('/');
            }
        } catch (error) {
            console.log('error in login component: ',error)
            setError(error.message);
        }
    }
    return (
        <div className='flex items-center justify-center w-full my-8'>
            <div className={`mx-auto w-full max-w-lg bg-white rounded-xl p-10`}>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in</h2>
                <p className="mt-2 text-center text-base text-black/60">Don't have an account?
                    <Link to='/signup'
                    
                    >&nbsp;<span className="font-medium text-primary transition-all duration-200 hover:underline">Signup</span></Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                        label='Email: '
                        placeholder='Enter your email'
                        type='email'
                        {...register('email',{required:true,
                            validate: {
                                matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Email address must be a valid address",
                            }
                        })}
                        ></Input>
                        <Input
                        label="Password: "
                        placeholder="Enter your password"
                        type="password"
                        {...register("password",{
                        required: true,
                    })}
                    />
                    <Button
                    type="submit"
                    >Sign in</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default Login