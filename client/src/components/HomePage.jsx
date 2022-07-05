import React from 'react';
import { useAuth } from '../lib/authContext';

export const HomePage = () => {
    const { user } = useAuth();

    return (
        <div className='bg-white max-w-xs m-auto h-[2000px]'>
            <h1>Hi, {user.firstName}!</h1>
        </div>
    );
}
