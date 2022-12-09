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
import { BadRequestPage } from "./components/BadRequestPage";
import { PageNotFoundPage } from "./components/PageNotFoundPage";
import { InternalServerErrorPage } from "./components/InternalServerErrorPage";

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
				<Route path="/400" element={<BadRequestPage />} />
				<Route path="/404" element={<PageNotFoundPage />} />
				<Route path="/500" element={<InternalServerErrorPage />} />
			</Routes>
		</div>
	);
}

export default App;
