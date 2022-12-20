import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ProvideAuth } from './context/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<ProvideAuth>
			<App />
		</ProvideAuth>
	</BrowserRouter>
);

//TODO: change favicon
//TODO: add titles for each page
