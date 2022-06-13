import './App.css';
import React from 'react';
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';

function App() {
  return (
    <div className="App h-screen bg-gray-800 py-24">
        <LoginPage />
    </div>
  );
}

export default App;
