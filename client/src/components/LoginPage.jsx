import React from 'react'

export const LoginPage = () => {
  return (
    <div className='w-full max-w-md mx-auto'>
        <form class='bg-gray-700 shadow-md rounded px-8 pt-10 pb-8 mb-4'>
            <div className='mb-7'><h1 className='text-4xl font-bold text-white'>Log In</h1></div>
            <div className="mb-6">
                <input className='bg-gray-600 appearance-none border-2 border-gray-600 rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:bg-gray-500 focus:border-gray-600' type='text' name='iemail' id='iemail' placeholder='Email'/>
            </div>
            <div className="mb-6">
                <input className='bg-gray-600 appearance-none border-2 border-gray-600 rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:bg-gray-500 focus:border-gray-500' type='password' name='ipassword' id='ipassword' placeholder='Password'/>
            </div>
            <div>
                <button class='bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button'>Login</button>
            </div>
        </form>
    </div>
  )
}
