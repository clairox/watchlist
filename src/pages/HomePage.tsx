import axios from '../lib/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WatchlistPreviewSlider } from '../components/WatchlistPreviewSlider';
import { Watchlist } from '../../types';
import { Helmet } from 'react-helmet';

export const HomePage = () => {
	const [watchlists, setWatchlists] = useState<Watchlist[]>([]);

	const { user } = useAuth();

	useEffect(() => {
		if (user?.id) {
			axios
				.get(`/watchlists/`, {
					withCredentials: true,
				})
				.then(res => {
					setWatchlists(res.data);
				});
		}
	}, [user?.id]);

	const sortWatchlists = (watchlists: Watchlist[]): Watchlist[] => {
		return watchlists
			.sort((a: Watchlist, b: Watchlist) => {
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
			.sort((a: Watchlist, b: Watchlist) => {
				const aDefault = a.default ? 1 : 0;
				const bDefault = b.default ? 1 : 0;
				return bDefault - aDefault;
			});
	};

	//TODO: make watchlist image column which is equal to the most recently added poster or a custom image
	return (
		<div>
			<Helmet>
				<title>Watchlist</title>
			</Helmet>
			<ul>
				{sortWatchlists(watchlists).map((data: Watchlist, i) => (
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
						.then(res => setWatchlists([...watchlists, res.data]));
				}}
			>
				<FontAwesomeIcon icon={faPlus} size="lg" color="white" />
			</button>
		</div>
	);
};
