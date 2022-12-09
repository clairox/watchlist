import axios from "../lib/axiosInstance";
import React, { useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WatchlistPreviewSlider } from "./WatchlistPreviewSlider";

export const HomePage = () => {
	const [watchlists, setWatchlists] = useState([]);

	const { user } = useAuth();

	useEffect(() => {
		if (user.id) {
			alert(user.id)
			axios
				.get(`/watchlists/`, {
					withCredentials: true,
				})
				.then((res) => {
					setWatchlists(res.data);
				});
		}
	}, [user.id]);

	//TODO: make watchlist image column which is equal to the most recently added poster or a custom image
	return (
		<div>
			<ul>
				{watchlists
					.sort((a, b) => {
						const nameA = a.name.toUpperCase();
						const nameB = b.name.toUpperCase();
						if (nameA < nameB) {
							return -1;
						}
						if (nameA > nameB) {
							return 1;
						}
						return 0;
					})
					.sort((a, b) => b.default - a.default)
					.map((data, i) => (
						<WatchlistPreviewSlider data={data} key={data.id} />
					))}
			</ul>
			<button
				className="float-left ml-4 mt-4 w-20 rounded-full bg-gray-700 py-2 hover:cursor-pointer hover:bg-gray-600"
				onClick={() => {
					axios
						.post(
							`/watchlists/`,
							{},
							{
								withCredentials: true,
							}
						)
						.then((res) =>
							setWatchlists([...watchlists, res.data])
						);
				}}
			>
				<FontAwesomeIcon icon={faPlus} size="xl" color="white" />
			</button>
		</div>
	);
};
