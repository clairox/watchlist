import axios from "../lib/axiosInstance";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/authContext";
import { Watchlist } from "../../types";
import { Helmet } from "react-helmet";

type ItemProps = {
	data: Watchlist;
	index: number;
}

const WatchlistItem: React.FunctionComponent<ItemProps> = ({ data, index }) => {
	const { name } = data;
	return (
		<div className="m-6 flex flex-col rounded-lg bg-gray-700 p-3 pl-6 text-left hover:bg-gray-600 ">
			<h2 className="text-xl font-bold text-gray-100">
				{name === "Default" ? "Your Watchlist" : name}
			</h2>
		</div>
	);
};

export const ListsPage = () => {
	const [watchlists, setWatchlists] = useState([]);

	const { user } = useAuth();

	useEffect(() => {
		if (user?.id) {
			axios
				.get(`/watchlists/`, {
					withCredentials: true,
				})
				.then((res) => {
					setWatchlists(res.data);
				});
		}
	}, [user?.id]);

	return (
		<div>
			<Helmet>
				<title>Lists</title>
			</Helmet>
			<ul>
				{watchlists.map((data: Watchlist, i: number) => (
					<Link to={`/lists/${data.id}`} key={i}>
						<WatchlistItem data={data} index={i} />
					</Link>
				))}
			</ul>
		</div>
	);
};
