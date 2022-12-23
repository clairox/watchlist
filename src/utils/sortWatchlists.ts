import { Watchlist } from '../../types';

const sortWatchlists = (watchlists: Watchlist[]) => {
	const defaultList = watchlists.find((list: Watchlist) => list.default);
	const rest = watchlists.filter((list: Watchlist) => !list.default);

	const sorted = rest.sort((a: Watchlist, b: Watchlist) => {
		const nameA = a.name.toUpperCase();
		const nameB = b.name.toUpperCase();
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});

	return defaultList ? [defaultList, ...sorted] : sorted;
};

export default sortWatchlists;
