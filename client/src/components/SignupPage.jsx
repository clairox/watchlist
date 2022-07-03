import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';

export const SignupPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [invalidSignupWarning, setInvalidSignupWarning] = useState(<></>);

    // Border Color Classes
    const [firstNameBCC, setFirstNameBCC] = useState('border-gray-600');
    const [lastNameBCC, setLastNameBCC] = useState('border-gray-600');
    const [emailBCC, setEmailBCC] = useState('border-gray-600');
    const [passwordBCC, setPasswordBCC] = useState('border-gray-600');


    const { user, signup, checkEmailAvailability } = useAuth() || {};
    
    const navigate = useNavigate();
    const location = useLocation();

    const { from } = location?.state || { from: { pathname: '/' } };

    const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    useEffect(() => {
        if (user) {
            navigate(from)
        }
    }, [user, navigate, from])
    
    return (
        <div className='w-full lg:max-w-md min-h-screen mx-auto lg:py-24'>
            <form className='bg-gray-700 shadow-sm rounded min-h-screen lg:min-h-fit px-8 pt-24 lg:pt-10 pb-8' onSubmit={async e => {
                e.preventDefault();
                setInvalidSignupWarning();

                const warningsList = []

                if (firstName.length < 2) {
                    warningsList.push(<li key='firstNameTooShort'>First name should be at least 2 characters</li>)
                }

                if (lastName.length < 2) {
                    warningsList.push(<li key='lastNameTooShort'>Last name should be at least 2 characters</li>)
                }
                
                if (EMAIL_PATTERN.test(email)) {
                    const isEmailAvailable = await checkEmailAvailability(email);
                    if (!isEmailAvailable) {
                        warningsList.push(<li key='emailUnavailable'>Email is already in use</li>)
                    }
                }
                else {
                    warningsList.push(<li key='emailInvalid'>Please enter a valid email</li>)
                }

                if (password.length < 8) {
                    warningsList.push(<li key='passwordTooShort'>Password should be at least 8 characters</li>)
                }
                
                const warning = (
                    <div className='mb-4 p-5 w-full shadow-sm bg-red-500 rounded text-white text-left'>
                        <p className='mb-3'>The following errors must be fixed before you sign up</p>
                        <ul className='list-disc pl-6'>{warningsList.map(w => {
                            switch (w.key) {
                                case 'firstNameTooShort':
                                    setFirstNameBCC('border-red-500');
                                    return w;
                                case 'lastNameTooShort':
                                    setLastNameBCC('border-red-500');
                                    return w;
                                case 'emailUnavailable':
                                    setEmailBCC('border-red-500');
                                    return w;
                                case 'emailInvalid':
                                    setEmailBCC('border-red-500');
                                    return w;
                                case 'passwordTooShort':
                                    setPasswordBCC('border-red-500');
                                    return w;
                                default: 
                                    return w;
                            }
                        })}</ul>
                    </div>
                )

                if (warningsList.length) {
                    setInvalidSignupWarning(warning)
                    return
                }

                signup({
                    firstName,
                    lastName,
                    email,
                    password
                });
            }}>
                <div className='max-w-[384px] mx-auto'>
                    <div className='flex flex-col items-start'>
                        <div className='mb-7 w-full'>
                            <h1 className='text-4xl font-bold text-white'>Sign up</h1>
                        </div>
                        {invalidSignupWarning}
                        <div className='mb-6 flex flex-row w-full '>
                            <div className='mr-4 grow'>
                                <input 
                                    className={`bg-gray-600 appearance-none border-2 ${firstNameBCC} rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:bg-gray-500`} 
                                    type='text' 
                                    name='ifirst' 
                                    id='ifirst' 
                                    placeholder='First' 
                                    value={firstName} 
                                    onChange={e=>{
                                        setFirstName(e.target.value)
                                        setFirstNameBCC('border-gray-600')
                                    }}
                                />
                            </div>
                            <div className='grow'>
                                <input 
                                    className={`bg-gray-600 appearance-none border-2 ${lastNameBCC} rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:bg-gray-500`}
                                    type='text' 
                                    name='ilast' 
                                    id='ilast' 
                                    placeholder='Last' 
                                    value={lastName} 
                                    onChange={e=>{
                                        setLastName(e.target.value)
                                        setLastNameBCC('border-gray-600')
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mb-6 w-full">
                            <input 
                                className={`bg-gray-600 appearance-none border-2 ${emailBCC} rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:bg-gray-500`} 
                                type='text' 
                                name='iemail' 
                                id='iemail' 
                                placeholder='Email' 
                                value={email} 
                                onChange={e=>{
                                    setEmail(e.target.value)
                                    setEmailBCC('border-gray-600')
                                }}
                            />
                        </div>
                        <div className="mb-6 w-full">
                            <input 
                                className={`bg-gray-600 appearance-none border-2 ${passwordBCC} rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:bg-gray-500`} 
                                type='password' 
                                name='ipassword' 
                                id='ipassword' 
                                placeholder='Password' 
                                value={password} 
                                onChange={e=>{
                                    setPassword(e.target.value)
                                    setPasswordBCC('border-gray-600')
                                }}
                            />
                        </div>
                        <div className='mb-4 w-full'>
                            <button 
                                className='bg-gray-500 hover:bg-gray-600 disabled:bg-gray-500 disabled:hover:bg-gray-500 text-white disabled:text-gray-400 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' 
                                type='submit' 
                                disabled={firstName === '' || lastName === '' || email === '' || password === ''}
                            >
                                Sign up
                            </button>
                        </div>
                    </div>
                    <div>
                        <p className='text-gray-300'>Already have an account? <Link to='/login' className='text-white'>Login</Link></p>
                    </div>
                </div>
            </form>
        </div>
    );
}