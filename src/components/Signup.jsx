import React from 'react'
import authService from '../appwrite/auth'
import {login} from '../slice/authSlice'
import {Link,useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {Input, Button} from './Index.js'


function Signup() {
    const navigate= useNavigate();
    const [error, setError] = useState('');
    const dispatch = useDispatch()
    const {register, handleSubmit} =useForm();

    const create = async(data) => {
        setError(''); // reset error
        try {
            const userData = await authService.createAccount(data)
            if(userData) {
                const currentUserData = await authService.getCurrentUser()
                if(currentUserData){
                    dispatch(login(currentUserData));
                }
                navigate('/');
            }
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-3 mb-3 text-center text-base text-black/60">Already have an account?&nbsp;
                    <Link to='/login' className="font-medium text-primary transition-all duration-200 hover:underline">Sign in</Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>
                        <Input
                        label="Full Name: "
                        placeholder='Enter your full name'
                        {...register('name', {
                            required: true,
                        })}
                        />
                        <Input
                        label='Email: '
                        placeholder='Enter your email'
                        type='email'
                        {...register('email', {
                            required: true,
                        })}
                        />
                        <Input
                        label="Password: "
                        placeholder='Enter your plassword'
                        type='password'
                        {...register('password',{
                            required: true,
                        })}
                        />
                        <Button type='submit' className="w-full">Create Account</Button>
                    </div>
                </form>
            </div>
        </div>
    )
    
}


export default Signup