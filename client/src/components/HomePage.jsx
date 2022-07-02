import React from 'react';
import { useAuth } from '../lib/authContext';

export const HomePage = () => {
    const { user, logout } = useAuth();

    return (
        <div className='bg-white max-w-xs m-auto'>
            <h1>Hi, {user.firstName}!</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
