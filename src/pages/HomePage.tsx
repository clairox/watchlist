import axios from '../lib/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WatchlistPreviewSlider } from '../components/WatchlistPreviewSlider';
import { Watchlist } from '../../types';
import { Helmet } from 'react-helmet';

export const HomePage: React.FunctionComponent = () => {
	return (
		<Helmet>
			<title>Home | Watchlist</title>
		</Helmet>
	);
};
