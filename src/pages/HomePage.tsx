import { Dispatch, SetStateAction, FunctionComponent } from 'react';
import { Helmet } from 'react-helmet';
import Watchlists from '../components/Watchlists';

type Props = {
	setSearchBarOpen: Dispatch<SetStateAction<boolean>>;
};

export const HomePage: FunctionComponent<Props> = ({ setSearchBarOpen }) => {
	return (
		<div>
			<Helmet>
				<title>Home | Watchlist</title>
			</Helmet>
			<Watchlists {...{ setSearchBarOpen }} />
		</div>
	);
};
