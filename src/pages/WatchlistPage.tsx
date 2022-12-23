import axios from '../lib/axiosInstance';
import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { faPencil, faXmark, faTrashCan, faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WatchlistItem as WI } from '../../types';
import { Helmet } from 'react-helmet';
import { ErrorPage } from './ErrorPage';
import Button from '../components/Button';

type ItemProps = {
	data: WI;
	inEditMode: boolean;
	deleteItem: (itemId: number) => void;
	setWatched: (itemId: number) => void;
};

const WatchlistItem: React.FunctionComponent<ItemProps> = ({
	data,
	inEditMode,
	deleteItem,
	setWatched,
}) => {
	const { title, poster_url, release_date, watched } = data;

	return (
		<div
			className={`my-3 mx-6 flex flex-row rounded-lg ${
				watched ? 'bg-green-700' : 'bg-gray-700'
			} p-4 text-white hover:cursor-pointer ${
				watched ? 'hover:bg-green-600' : 'hover:bg-gray-600'
			} md:mx-3`}
			onClick={() => {
				if (!inEditMode) {
					setWatched(data.id);
				}
			}}
		>
			<img
				className="w-20"
				src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${poster_url}`}
				alt="movie poster"
			/>
			<div className=" flex flex-col pl-4 text-left">
				<h3 className="text-lg font-bold">{title}</h3>
				<p>{release_date}</p>
			</div>
			{inEditMode ? (
				<div className="flex-grow pr-1 text-right">
					<FontAwesomeIcon
						className="relative hover:text-red-500"
						icon={faXmark}
						// @ts-ignore
						size="xl"
						color="white"
						onClick={() => {
							deleteItem(data.id);
						}}
					/>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

type WatchlistProps = {
	items: WI[];
	deleteItem: (itemId: number) => void;
	setWatched: (itemId: number) => void;
	editMode: boolean;
};

//TODO: Stop page showing login every load
const Watchlist = React.memo<WatchlistProps>(props => {
	const { items, deleteItem, setWatched, editMode } = props;

	return (
		<>
			<ul className="md:grid-col-3 flex max-w-[1600px] flex-col justify-center py-3 md:mx-auto md:grid md:grid-flow-row md:grid-cols-2 md:px-3 lg:grid-cols-3 xl:grid-cols-4">
				{items
					.filter(data => !data.watched)
					.map((data, i) => (
						<WatchlistItem
							data={data}
							deleteItem={deleteItem}
							setWatched={setWatched}
							inEditMode={editMode}
							key={i}
						/>
					))}
			</ul>
			{items.find(data => data.watched) ? (
				<div>
					<h3 className="text-2xl font-bold text-gray-100">Watched</h3>
					<ul className="md:grid-col-3 flex max-w-[1600px] flex-col justify-center py-3 md:mx-auto md:grid md:grid-flow-row md:grid-cols-2 md:px-3 lg:grid-cols-3 xl:grid-cols-4">
						{items
							.filter(data => data.watched)
							.map((data, i) => (
								<WatchlistItem
									data={data}
									deleteItem={deleteItem}
									setWatched={setWatched}
									inEditMode={editMode}
									key={i}
								/>
							))}
					</ul>
				</div>
			) : (
				<></>
			)}
		</>
	);
});

//TODO: save media type to db and show in watchlist
export const WatchlistPage: React.FunctionComponent = () => {
	const [items, setItems] = useState<WI[]>([]);
	const [name, setName] = useState('');
	const [isDefault, setIsDefault] = useState(false);
	const [count, setCount] = useState(0);
	const [editMode, setEditMode] = useState(false);
	const [editedName, setEditedName] = useState('');

	const [content, setContent] = useState(<></>);

	const [isLoading, setIsLoading] = useState(true);

	const { id } = useParams();

	const navigate = useNavigate();

	const deleteItem = useCallback(
		async (itemId: number) => {
			axios
				.delete(`/watchlists/${id}/items/${itemId}`, {
					withCredentials: true,
				})
				.then(async res => {
					axios
						.get(`/watchlists/${id}/itemCount`, {
							withCredentials: true,
						})
						.then(res => setCount(res.data));
					setItems(items.filter(data => data.id !== itemId));
				});
		},
		[id, items]
	);

	const setWatched = useCallback(
		(itemId: number) => {
			const item = items.find(data => data.id === itemId);

			if (!item) return;

			axios
				.patch(
					`/watchlists/${id}/items/${itemId}/watched`,
					{ watched: !item.watched },
					{ withCredentials: true }
				)
				.then(res => {
					setItems(
						items.map(data => {
							if (data.id === itemId) {
								return {
									...data,
									watched: !data.watched,
								};
							}
							return data;
						})
					);
				});
		},
		[id, items]
	);

	// Get watchlist data on page load
	useEffect(() => {
		setIsLoading(true);

		axios
			.get(`/watchlists/${id}?populated=true`, {
				withCredentials: true,
			})
			.then(res => {
				setName(res.data.name);
				setItems(res.data.items);
				setIsDefault(res.data.default);
				setCount(res.data.item_count);

				setIsLoading(false);
			})
			.catch(() => setIsLoading(false));
	}, [id]);

	useEffect(() => {
		if (isLoading) return;

		//TODO: useToggle hook
		const watchlistProps = {
			items,
			deleteItem,
			setWatched,
			editMode,
		};

		if (name) {
			setContent(
				<div>
					<div className="mx-7 flex max-w-[1500px] flex-col justify-between gap-4 sm:flex-row sm:gap-0 2xl:mx-auto">
						{editMode ? (
							<form
								className="flex flex-grow flex-row "
								onSubmit={e => {
									e.preventDefault();
									axios
										.patch(
											`/watchlists/${id}/name`,
											{
												name: editedName,
											},
											{ withCredentials: true }
										)
										.then(res => {
											setEditedName('');
											setEditMode(false);
											setName(res.data);
										});
								}}
							>
								<input
									className="w-full max-w-[550px] border-b-[1px] border-gray-100 bg-gray-800 pr-8 text-2xl font-bold text-gray-100 focus:outline-none md:w-2/3 md:text-3xl lg:w-1/2"
									type="text"
									name="editName"
									id="iEditName"
									value={editedName}
									onChange={e => setEditedName(e.target.value)}
									autoComplete="off"
									autoFocus={true}
								/>
								<FontAwesomeIcon
									className="relative right-5 pt-1 hover:cursor-pointer md:pt-2"
									icon={faXmark}
									// @ts-ignore
									size="xl"
									color="white"
									onClick={() => {
										setEditedName('');
									}}
								/>
							</form>
						) : (
							<div className="max-w-[1500px] text-left ">
								{isDefault ? (
									<div className="md:text-md relative bottom-[3px] mr-4 inline-block text-sm text-gray-100 md:bottom-1">
										<FontAwesomeIcon icon={faLock} size="lg" />
									</div>
								) : (
									<></>
								)}
								<h1 className="mr-4 inline-block text-2xl font-bold text-gray-100 md:text-3xl">
									{name}
								</h1>
								<span className="mr-4 inline-block text-2xl font-bold text-gray-400">
									{count}
								</span>
							</div>
						)}
						<div className="flex flex-row justify-end gap-4">
							{editMode ? (
								<Button onClick={() => setEditMode(false)}>
									<FontAwesomeIcon className="pr-2" icon={faCheck} size="1x" />
									<span className="text-lg">Finish</span>
								</Button>
							) : (
								<Button onClick={() => setEditMode(true)}>
									<FontAwesomeIcon className="pr-2" icon={faPencil} size="1x" />
									<span className="text-lg">Edit</span>
								</Button>
							)}
							{!editMode && (
								<Button
									level="danger"
									disabled={isDefault}
									onClick={() => {
										if (isDefault) return;

										axios
											.delete(`/watchlists/${id}/`, {
												withCredentials: true,
											})
											.then(() => navigate('/lists'));
									}}
								>
									<FontAwesomeIcon className="pr-2" icon={faTrashCan} size="1x" />
									<span className="text-lg">Delete</span>
								</Button>
							)}
						</div>
					</div>
					<Watchlist {...watchlistProps} />
				</div>
			);
		} else {
			setContent(<ErrorPage code={404} message={'Page Not Found'} />);
		}
	}, [
		isLoading,
		editMode,
		name,
		count,
		isDefault,
		editedName,
		items,
		deleteItem,
		id,
		navigate,
		setWatched,
	]);

	return (
		<div className="mt-6">
			<Helmet>
				<title>{name ? `${name} | Watchlist` : 'Watchlist'}</title>
			</Helmet>
			{content}
		</div>
	);
};
