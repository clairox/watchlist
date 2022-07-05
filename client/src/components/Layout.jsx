import React, { useState } from 'react'
import { Outlet } from 'react-router'
import { Navbar } from './Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


export const Layout = () => {
    const [sideMenuOpen, setSideMenuOpen] = useState(false);
    return (
        <div>
            <div>
                <Navbar sideMenuOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
            </div>
            <div className='pt-14'>
                <Outlet/>
            </div>
            <nav className={'transform fixed top-0 left-0 bg-gray-700 w-64 h-full overflow-auto ease-in-out transition-all duration-300 z-30 text-gray-100 drop-shadow-lg lg:hidden ' + (sideMenuOpen ? 'translate-x-0' : '-translate-x-full')} >
                <div className='flex flex-col'>
                    <div>
                        <FontAwesomeIcon icon={faXmark} size='xl' className='hover:cursor-pointer float-right mr-5 mt-3' onClick={()=>setSideMenuOpen(false)}/>
                    </div>
                    <div className='mt-4'>
                        <ul className='text-left text-[17px]'>
                            <li>
                                <Link to='/lists'>
                                    <div className='h-[46px] border-b-[1px] pl-5 border-gray-500 hover:border-inherit leading-[45px] hover:cursor-pointer' onClick={()=>setSideMenuOpen(false)}>
                                        Lists   
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to='/favorites'>
                                    <div className='h-[46px] border-b-[1px] pl-5 border-gray-500 hover:border-inherit leading-[45px] hover:cursor-pointer' onClick={()=>setSideMenuOpen(false)}>
                                        Favorites   
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}
