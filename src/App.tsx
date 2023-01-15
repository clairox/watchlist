import './assets/App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { PrivateRoute } from './components/PrivateRoute';
import { SignupPage } from './pages/SignupPage';
import { Layout } from './components/Layout';
import { WatchlistPage } from './pages/WatchlistPage';
import { ErrorPage } from './pages/ErrorPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
	return (
		<div className="App min-h-screen bg-gray-800 pb-20">
			<Routes>
				<Route element={<Layout />}>
					<Route index element={<HomePage />} />
					<Route path="/lists/:id" element={<WatchlistPage />} />
					<Route element={<PrivateRoute />}>
						<Route path="/settings" element={<SettingsPage />} />
					</Route>
					<Route path="*" element={<ErrorPage code={404} message={'Page Not Found'} />} />
				</Route>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/400" element={<ErrorPage code={400} message={'Bad Request'} />} />
				<Route path="/404" element={<ErrorPage code={404} message={'Page Not Found'} />} />
				<Route path="/500" element={<ErrorPage code={500} message={'Internal Server Error'} />} />
			</Routes>
		</div>
	);
}

export default App;
