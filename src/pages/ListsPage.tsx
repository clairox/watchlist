import axios from '../lib/axiosInstance';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Watchlist } from '../../types';
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
