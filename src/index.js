import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ProvideAuth } from './lib/authContext';

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
