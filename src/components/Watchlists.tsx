import axios from '../lib/axiosInstance';
import React, { useEffect, useState } from 'react';
import { Watchlist } from '../../types';
import { useAuth } from '../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSort } from '@fortawesome/free-solid-svg-icons';
import { WatchlistPreviewSlider } from './WatchlistPreviewSlider';
import Button from './Button';
import sortWatchlists from '../utils/sortWatchlists';

//TODO: add local watchlists to db on sign in

const Watchlists = () => {
	const { user, isLoading: isUserLoading } = useAuth();

	const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [content, setContent] = useState(<></>);

	const getWatchlists = () => {
		setIsLoading(true);

		if (!user) {
			setIsLoading(false);
			return JSON.parse(localStorage.getItem('watchlists') || '[]');
		} else {
			setIsLoading(false);
			return JSON.parse(localStorage.getItem('watchlists') || '[]');
		}
	};

	const _setWatchlists = (watchlists: Watchlist[]) => {
		localStorage.setItem('watchlists', JSON.stringify(watchlists));
		setWatchlists(getWatchlists());
	};

	// Get watchlists on page load
	useEffect(() => {
		if (isUserLoading || watchlists.length) return;

		setIsLoading(true);

		if (!user) {
			setWatchlists(JSON.parse(localStorage.getItem('watchlists') || '[]'));
			setIsLoading(false);
		} else {
			axios
				.get(`/watchlists/`, {
					withCredentials: true,
				})
				.then(res => {
					_setWatchlists(res.data);
					setIsLoading(false);
				});
		}
	}, [user, isUserLoading]);

	// Set page content
	useEffect(() => {
		if (isLoading) return;

		if (!watchlists.length) {
			setContent(
				<div className="mt-10">
					<h3 className="text-3xl font-bold text-gray-400">
						You don't have any watchlists
					</h3>
					<div className="mt-4">
						<NewWatchlistButton onClick={createWatchlist} />
					</div>
				</div>
			);
		} else {
			setContent(
				<div>
					<div className="flex w-full justify-end gap-4">
						{/* <Button onClick={() => {}}>
							<FontAwesomeIcon className="pr-2" icon={faSort} size="1x" />
							<span className="text-lg">Sort</span>
						</Button> */}
						<NewWatchlistButton onClick={createWatchlist} />
					</div>
					<ul>
						{sortWatchlists(watchlists).map((data: Watchlist, i) => (
							<WatchlistPreviewSlider data={data} key={data.id} />
						))}
					</ul>
				</div>
			);
		}
	}, [watchlists, isLoading]);

	const createWatchlist = () => {
		setIsLoading(true);

		if (!user) {
			const newList: Watchlist = {
				id: watchlists.length.toString(), // TODO: change id to serial in db
				owner_id: 'local',
				name: 'New watchlist',
				default: false,
				createdAt: new Date(),
			};

			_setWatchlists([...watchlists, newList]);
			setIsLoading(false);
		} else {
			axios
				.post(
					`/watchlists/`,
					{},
					{
						withCredentials: true,
					}
				)
				.then(res => {
					const newList = res.data;
					_setWatchlists([...watchlists, newList]);
					setIsLoading(false);
				});
		}
	};

	//TODO: make watchlist image column which is equal to the most recently added poster or a custom image

	return <div>{content}</div>;
};

type ButtonProps = {
	onClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const NewWatchlistButton: React.FunctionComponent<ButtonProps> = ({ onClick }) => {
	return (
		<Button onClick={onClick}>
			<FontAwesomeIcon className="pr-2" icon={faPlus} size="1x" />
			<span className="text-lg">New</span>
		</Button>
	);
};

export default Watchlists;
