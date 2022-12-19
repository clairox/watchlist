import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { HomePage } from "./components/HomePage";
import { PrivateRoute } from "./components/PrivateRoute";
import { SignupPage } from "./components/SignupPage";
import { Layout } from "./components/Layout";
import { ListsPage } from "./components/ListsPage";
import { FavoritesPage } from "./components/FavoritesPage";
import { WatchlistPage } from "./components/WatchlistPage";
import { ErrorPage } from "./components/ErrorPage";

//TODO: write a README.md
function App() {
	return (
		<div className="App min-h-screen bg-gray-800 pb-20">
			<Routes>
				<Route element={<PrivateRoute />}>
					<Route element={<Layout />}>
						<Route index element={<HomePage />} />
						<Route path="/lists" element={<ListsPage />} />
						<Route path="/lists/:id" element={<WatchlistPage />} />
						<Route path="/favorites" element={<FavoritesPage />} />
					</Route>
				</Route>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/400" element={<ErrorPage code={400} message={"Bad Request"} />} />
				<Route path="/404" element={<ErrorPage code={404} message={"Page Not Found"} />} />
				<Route path="/500" element={<ErrorPage code={500} message={"Internal Server Error"} />} />
			</Routes>
		</div>
	);
}

export default App;
