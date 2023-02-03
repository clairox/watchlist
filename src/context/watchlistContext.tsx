import axios from '../lib/axiosInstance';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoadState, WatchlistItem, WatchlistWithItems } from '../../types';
import { useAuth } from './authContext';
import { v4 as uuid } from 'uuid';

const WatchlistsContext = createContext<{
	watchlists?: WatchlistWithItems[];
	watchlistLoadState?: LoadState;
	getWatchlist?: (id: string) => Promise<WatchlistWithItems | null>;
	createWatchlist?: (name: string, isDefault: boolean) => Promise<WatchlistWithItems | null>;
	updateWatchlistName?: (id: string, name: string) => Promise<WatchlistWithItems | null>;
	deleteWatchlist?: (id: string) => void;
	addItem?: (
		watchlistId: string,
		data: Omit<WatchlistItem, 'watchlist_id' | 'createdAt' | 'watched'>
	) => Promise<void>;
	setItemWatched?: (watchlistId: string, itemId: number, watched: boolean) => Promise<void>;
	deleteItem?: (watchlistId: string, itemId: number) => Promise<void>;
	clearWatchlists?: () => void;
}>({});

type WatchlistsProviderProps = {
	children: React.ReactNode;
};

export const ProvideWatchlists: React.FunctionComponent<WatchlistsProviderProps> = ({ children }) => {
	const watchlists = useProvideWatchlists();
	return <WatchlistsContext.Provider value={watchlists}>{children}</WatchlistsContext.Provider>;
};

export const useWatchlists = () => {
	return useContext(WatchlistsContext);
};

const useProvideWatchlists = () => {
	let { user } = useAuth();

	const [watchlists, _setWatchlists] = useState<WatchlistWithItems[]>([]);
	const [loadState, setLoadState] = useState<LoadState>('idle');
	const [isLoggedIn, setIsLoggedIn] = useState(user !== null);

	const setWatchlists = (wl: WatchlistWithItems[]) => {
		const defaultList = wl.find(l => l.default);
		const empty = wl.filter(l => l.items.length === 0);
		const rest = wl.filter(l => !l.default && l.items.length > 0);

		const sorted1 = rest
			.map(l => ({ ...l, createdAt: new Date(l.createdAt) }))
			.sort((a: WatchlistWithItems, b: WatchlistWithItems) => {
				const nameA = a.name.toUpperCase();
				const nameB = b.name.toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				if (nameA === nameB) {
					return +b.createdAt - +a.createdAt;
				}
				return 0;
			});

		const sorted2 = empty
			.map(l => ({ ...l, createdAt: new Date(l.createdAt) }))
			.sort((a: WatchlistWithItems, b: WatchlistWithItems) => {
				const nameA = a.name.toUpperCase();
				const nameB = b.name.toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				if (nameA === nameB) {
					return +b.createdAt - +a.createdAt;
				}
				return 0;
			});

		_setWatchlists(defaultList ? [defaultList, ...sorted1, ...sorted2] : [...sorted1, ...sorted2]);
	};

	const getWatchlist = async (id: string): Promise<WatchlistWithItems | null> => {
		if (!user) {
			return getLocalWatchlists().find(l => l.id === id) || null;
		} else {
			return await getServerWatchlists()
				.then(watchlist => watchlist.find(l => l.id === id) || null)
				.catch(() => null);
		}
	};

	const reqConfig = { withCredentials: true };

	const getLocalWatchlists = (): WatchlistWithItems[] => JSON.parse(localStorage.getItem('watchlists') || '[]');

	const getServerWatchlists = async (): Promise<WatchlistWithItems[]> =>
		axios
			.get('/watchlists?populated=true', reqConfig)
			.then(res => res.data)
			.catch(() => []);

	const setLocalWatchlists = (data: WatchlistWithItems[]) => localStorage.setItem('watchlists', JSON.stringify(data));

	const createWatchlist = async (name: string, isDefault: boolean): Promise<WatchlistWithItems | null> => {
		if (loadState !== 'succeeded') return null;

		name = name || 'New watchlist';

		if (!user) {
			// If user is creating new default watchlist, remove default status from current default watchlist
			if (isDefault) {
				const defaultWatchlist = getLocalWatchlists().find(l => l.default === true);
				if (defaultWatchlist) {
					defaultWatchlist.default = false;
					setLocalWatchlists([...getLocalWatchlists().filter(l => l.default === false), defaultWatchlist]);
				}
			}

			// Create new watchlist and store in localStorage
			const newWatchlist: WatchlistWithItems = {
				id: uuid(),
				name,
				default: isDefault,
				owner_id: 'local',
				createdAt: new Date(Date.now()),
				items: [],
			};

			setLocalWatchlists([...getLocalWatchlists(), newWatchlist]);
			setWatchlists(getLocalWatchlists());
			return newWatchlist;
		} else {
			// If user is creating new default watchlist, remove default status from current default watchlist
			if (isDefault) {
				const defaultWatchlist = await axios
					.get('/watchlists/default', reqConfig)
					.then(res => res.data)
					.catch(() => null);

				if (defaultWatchlist) {
					try {
						await axios
							.patch(`/watchlists/${defaultWatchlist.id}/default`, { isDefault: false }, reqConfig)
							.then(res => {})
							.catch(err => {
								throw new Error(err.message);
							});
					} catch {
						return null;
					}
				}
			}

			// Create new watchlist and store in db
			return await axios
				.post(
					'/watchlists',
					{
						name,
						isDefault,
					},
					reqConfig
				)
				.then(async res => {
					const newWatchlist = res.data;
					setWatchlists(await getServerWatchlists());
					return newWatchlist;
				})
				.catch(() => {
					return null;
				});
		}
	};

	const updateWatchlistName = async (id: string, name: string): Promise<WatchlistWithItems | null> => {
		if (loadState !== 'succeeded') return null;

		if (!user) {
			const list = await getWatchlist(id);
			const rest = getLocalWatchlists().filter(l => l.id !== id);
			if (!list) {
				return null;
			}

			const newList: WatchlistWithItems = {
				...list,
				name,
			};

			setLocalWatchlists([...rest, newList]);
			setWatchlists(getLocalWatchlists());

			return newList;
		} else {
			return await axios
				.patch(`/watchlists/${id}/name`, { name }, reqConfig)
				.then(async res => {
					const updatedWatchlist = res.data;
					setWatchlists(await getServerWatchlists());
					return updatedWatchlist;
				})
				.catch(() => {
					return null;
				});
		}
	};

	const deleteWatchlist = (id: string): void => {
		if (loadState !== 'succeeded') return;

		if (!user) {
			setLocalWatchlists(getLocalWatchlists().filter(l => l.id !== id));
			setWatchlists(getLocalWatchlists());
		} else {
			axios
				.delete(`/watchlists/${id}`, reqConfig)
				.then(async () => {
					setWatchlists(await getServerWatchlists());
				})
				.catch(() => {});
		}
	};

	const addItem = async (
		watchlistId: string,
		data: Omit<WatchlistItem, 'watchlist_id' | 'createdAt' | 'watched'>
	): Promise<void> => {
		if (loadState !== 'succeeded') return;

		if (!user) {
			const list = await getWatchlist(watchlistId);
			const rest = getLocalWatchlists().filter(l => l.id !== watchlistId);
			if (!list) {
				return;
			}

			list.items.unshift({
				...data,
				watchlist_id: watchlistId,
				createdAt: new Date(Date.now()),
				watched: false,
			} as WatchlistItem);

			setLocalWatchlists([...rest, list]);
			setWatchlists(getLocalWatchlists());
		} else {
			axios
				.put(
					`/watchlists/${watchlistId}/items`,
					{
						id: data.id,
						title: data.title,
						releaseDate: data.release_date,
						posterURL: data.poster_url,
					},
					reqConfig
				)
				.then(async () => {
					setWatchlists(await getServerWatchlists());
				})
				.catch(() => {});
		}
	};

	const setItemWatched = async (watchlistId: string, itemId: number, watched: boolean): Promise<void> => {
		if (loadState !== 'succeeded') return;

		if (!user) {
			const list = await getWatchlist(watchlistId);
			const rest = getLocalWatchlists().filter(l => l.id !== watchlistId);
			if (!list) {
				return;
			}

			list.items = list.items.map(i => {
				if (i.id === itemId) {
					return {
						...i,
						watched: i.id === itemId ? watched : i.watched,
					};
				}
				return i;
			});

			setLocalWatchlists([...rest, list]);
			setWatchlists(getLocalWatchlists());
		} else {
			axios
				.patch(`/watchlists/${watchlistId}/items/${itemId}/watched`, { watched }, reqConfig)
				.then(async () => {
					setWatchlists(await getServerWatchlists());
				})
				.catch(() => {});
		}
	};

	const deleteItem = async (watchlistId: string, itemId: number): Promise<void> => {
		if (loadState !== 'succeeded') return;

		if (!user) {
			const list = await getWatchlist(watchlistId);
			const rest = getLocalWatchlists().filter(l => l.id !== watchlistId);
			if (!list) {
				setLoadState('succeeded');
				return;
			}

			list.items = list.items.filter(i => i.id !== itemId);

			setLocalWatchlists([...rest, list]);
			setWatchlists(getLocalWatchlists());
			setLoadState('succeeded');
		} else {
			axios
				.delete(`/watchlists/${watchlistId}/items/${itemId}`, reqConfig)
				.then(async () => {
					setWatchlists(await getServerWatchlists());
					setLoadState('succeeded');
				})
				.catch(() => {
					setLoadState('succeeded');
				});
		}
	};

	const clearWatchlists = () => {
		localStorage.removeItem('watchlists');
		setWatchlists([]);
		setLoadState('idle');
	};
	useEffect(() => {
		// Retrieve watchlists from storage

		if (!isLoggedIn && user) {
			localStorage.removeItem('watchlists');
			setLoadState('idle');
		}

		user ? setIsLoggedIn(true) : setIsLoggedIn(false);

		if (loadState !== 'idle') return;
		setLoadState('loading');

		if (!user) {
			setWatchlists(JSON.parse(localStorage.getItem('watchlists') || '[]'));
			setLoadState('succeeded');
		} else {
			axios
				.get('/watchlists?populated=true', { withCredentials: true })
				.then(res => {
					setWatchlists(res.data);
					setLoadState('succeeded');
				})
				.catch(() => {
					setLoadState('failed');
				});
		}
	}, [isLoggedIn, loadState, user]);

	return {
		watchlists,
		watchlistLoadState: loadState,
		getWatchlist,
		createWatchlist,
		updateWatchlistName,
		deleteWatchlist,
		addItem,
		setItemWatched,
		deleteItem,
		clearWatchlists,
	};
};
