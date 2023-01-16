import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ProvideAuth } from './context/authContext';
import { ProvideWatchlists } from './context/watchlistContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<ProvideAuth>
			<ProvideWatchlists>
				<App />
			</ProvideWatchlists>
		</ProvideAuth>
	</BrowserRouter>
);

//TODO: change favicon
