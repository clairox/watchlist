import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { PrivateRoute } from './components/PrivateRoute';
import { SignupPage } from './components/SignupPage';

function App() {
  //TODO: optimize for mobile
  return (
    <div className="App min-h-screen bg-gray-800">
      <Routes>
        <Route path='/' element={<PrivateRoute/>}>
          <Route path='/' element={<HomePage/>}/>
        </Route>
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/signup' element={<SignupPage/>} />
      </Routes>
    </div>
  );
}

export default App;
