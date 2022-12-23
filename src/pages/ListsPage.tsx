import React from 'react';
import { Helmet } from 'react-helmet';
import Watchlists from '../components/Watchlists';

export const ListsPage = () => {
	return (
		<div>
			<Helmet>
				<title>Watchlists</title>
			</Helmet>
			<Watchlists />
		</div>
	);
};
