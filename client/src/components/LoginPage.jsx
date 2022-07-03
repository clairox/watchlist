import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [invalidLoginWarning, setInvalidLoginWarning] = useState(<></>);
    
    const navigate = useNavigate();
    const location = useLocation();

    const { user, login } = useAuth() || {};

    const { from } = location?.state || { from: { pathname: '/' } };

    useEffect(() => {
        if (user) {
            navigate(from)
        }
    }, [user, navigate, from])
    
    // form pt-10 pb-8 
    return (
        <div className='w-full lg:max-w-md min-h-screen mx-auto lg:py-24'>
            <form className='bg-gray-700 shadow-sm rounded min-h-screen lg:min-h-fit px-8 pt-24 lg:pt-10 pb-8' onSubmit={e => {
                e.preventDefault();
                setInvalidLoginWarning();

                login({ email, password })
                    .then(res => {
                    if (res.status === 401) {
                        setInvalidLoginWarning(
                            <div className='mb-4 p-1 px-5 w-full shadow-sm bg-red-500 rounded text-white '>
                                <p>Email or password incorrect. Please try again.</p>
                            </div>
                        );
                    }
                });
            }}>
                <div className='max-w-[384px] mx-auto'>
                    <div className='flex flex-col items-start'>
                        <div className='mb-7 w-full'><h1 className='text-4xl font-bold text-white'>Log in</h1></div>
                        {invalidLoginWarning}
                        <div className="mb-6 w-full">
                            <input className='bg-gray-600 appearance-none border-2 border-gray-600 rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:bg-gray-500 focus:border-gray-500' type='text' name='iemail' id='iemail' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)}/>
                        </div>
                        <div className="mb-6 w-full">
                            <input className='bg-gray-600 appearance-none border-2 border-gray-600 rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:bg-gray-500 focus:border-gray-500' type='password' name='ipassword' id='ipassword' placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)}/>
                        </div>
                        <div className='mb-4 w-full'>
                            <button className='bg-gray-500 hover:bg-gray-600 disabled:bg-gray-500 disabled:hover:bg-gray-500 text-white disabled:text-gray-400 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='submit' disabled={email === '' || password === ''}>Login</button>
                        </div>
                    </div>
                    <div>
                        <p className='text-gray-300'>New user? <Link to='/signup' className='text-white'>Create an account</Link></p>
                    </div>
                </div>
            </form>
        </div>
    );
}
