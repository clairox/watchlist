import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../lib/authContext';
import { useEffect } from 'react';

export const Navbar = ({ setSideMenuOpen }) => {
    const { logout } = useAuth();

    return (
        <nav className='bg-gray-700 h-14 fixed w-full drop-shadow-sm'>
            <div className='flex flex-row justify-between mx-auto max-w-screen-2xl text-gray-100'>
                <div className='ml-4 lg:ml-10 flex flex-row' id='nav-left' >
                    <div className='pr-6 lg:hidden leading-[56px]'>
                        <FontAwesomeIcon icon={faBars} size='xl' className='hover:cursor-pointer' onClick={()=>setSideMenuOpen(true)}/>
                    </div>
                    <div className='h-full'>
                        <Link to='/'>
                            <span className='text-3xl font-bold leading-[54px] h-full'>WL</span>
                        </Link>
                    </div>
                    <div className='hidden lg:flex flex-row ml-14 leading-[60px]'>
                        <div>
                            <Link to='/lists'>
                                <p className='text-md h-full' onClick={()=>setSideMenuOpen(false)}>Lists</p>
                            </Link>
                        </div>
                        <div className='ml-9'>
                            <Link to='/favorites'>
                                <p className='text-md h-full' onClick={()=>setSideMenuOpen(false)}>Favorites</p>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='mr-4 lg:mr-10' id='nav-right'>
                    <div className='leading-[56px]' onClick={logout}>
                        <FontAwesomeIcon icon={faRightFromBracket} size='xl' className='hover:cursor-pointer'/>
                    </div>
                </div>
            </div>
        </nav>
    )
}