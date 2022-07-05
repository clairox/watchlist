import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { PrivateRoute } from './components/PrivateRoute';
import { SignupPage } from './components/SignupPage';
import { Layout } from './components/Layout';

function App() {
  //TODO: optimize for mobile
  return (
    <div className="App min-h-screen bg-gray-800">
      <Routes>
        <Route element={<PrivateRoute/>}>
          <Route element={<Layout/>}>
            <Route index element={<HomePage/>}/>
          </Route>
        </Route>
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/signup' element={<SignupPage/>} />
      </Routes>
    </div>
  );
}

export default App;
