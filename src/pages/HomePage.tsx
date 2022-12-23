import React from 'react';
import { Helmet } from 'react-helmet';
import Watchlists from '../components/Watchlists';

export const HomePage: React.FunctionComponent = () => {
	return (
		<div>
			<Helmet>
				<title>Home | Watchlist</title>
			</Helmet>
			<Watchlists />
		</div>
	);
};
