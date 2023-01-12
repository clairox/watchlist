import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { faPencil, faXmark, faTrashCan, faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WatchlistItem as WI } from '../../types';
import { Helmet } from 'react-helmet';
import { ErrorPage } from './ErrorPage';
import Button from '../components/Button';
import { useWatchlists } from '../context/watchlistContext';
import { useModal } from '../hooks/useModal';
import ModalWrapper from '../components/ModalWrapper';

type ItemProps = {
	data: WI;
	inEditMode: boolean;
	deleteItem: (itemId: number) => void;
	setWatched: (itemId: number, watched: boolean) => void;
};

const WatchlistItem: React.FunctionComponent<ItemProps> = ({ data, inEditMode, deleteItem, setWatched }) => {
	const { title, poster_url, release_date, watched } = data;

	return (
		<div
			className={`my-3 mx-6 flex flex-row rounded-lg ${
				watched ? 'bg-green-700' : 'bg-gray-700'
			} p-4 text-white hover:cursor-pointer ${watched ? 'hover:bg-green-600' : 'hover:bg-gray-600'} md:mx-3`}
			onClick={() => {
				if (!inEditMode) setWatched(data.id, !data.watched);
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
						onClick={() => deleteItem(data.id)}
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
	setWatched: (itemId: number, watched: boolean) => void;
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
	const {
		getWatchlist,
		watchlistLoadState,
		deleteItem: deleteWatchlistItem,
		setItemWatched,
		updateWatchlistName,
		deleteWatchlist,
	} = useWatchlists();
	const { id } = useParams();

	const [items, setItems] = useState<WI[]>([]);
	const [name, setName] = useState('');
	const [isDefault, setIsDefault] = useState(false);
	const [count, setCount] = useState(0);
	const [isPageLoading, setIsPageLoading] = useState(true);

	useEffect(() => {
		if (getWatchlist && id && watchlistLoadState !== 'loading') {
			getWatchlist(id)
				.then(watchlist => {
					if (!watchlist) {
						setIsPageLoading(false);
						return;
					}

					setItems(watchlist.items);
					setName(watchlist.name);
					setIsDefault(watchlist.default);
					setCount(watchlist.items.length);
					setIsPageLoading(false);
				})
				.catch(() => {
					setIsPageLoading(false);
					return null;
				});
		}
	}, [getWatchlist, id, watchlistLoadState]);

	const [editMode, setEditMode] = useState(false);
	const [editedName, setEditedName] = useState('');

	const [content, setContent] = useState(<></>);

	const navigate = useNavigate();

	const deleteItem = useCallback(
		async (itemId: number) => {
			if (!deleteWatchlistItem || !id) return;
			deleteWatchlistItem(id, itemId);
		},
		[deleteWatchlistItem, id]
	);

	const setWatched = useCallback(
		(itemId: number, watched: boolean) => {
			if (!setItemWatched || !id) return;
			setItemWatched(id, itemId, watched);
		},
		[id, setItemWatched]
	);

	const onEditName = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!updateWatchlistName || !id) return;

			if (!editedName) {
				setEditedName('');
				setEditMode(false);
				return;
			}

			await updateWatchlistName(id, editedName);

			setEditedName('');
			setEditMode(false);
		},
		[editedName, id, updateWatchlistName]
	);

	const onDeleteWatchlist = useCallback(async () => {
		if (isDefault || !id || !deleteWatchlist) return;
		await deleteWatchlist(id);
		navigate('/');
	}, [deleteWatchlist, id, isDefault, navigate]);

	const {
		isOpen: isDeleteModalOpen,
		openModal: openDeleteModal,
		closeModal: closeDeleteModal,
		Modal: DeleteModal,
	} = useModal();

	useEffect(() => {
		if (isPageLoading) return;

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
							<form className="flex flex-grow flex-row " onSubmit={onEditName}>
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
								<span className="mr-4 inline-block text-2xl font-bold text-gray-400">{count}</span>
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
								<Button level="danger" disabled={isDefault} onClick={openDeleteModal}>
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
		watchlistLoadState,
		onEditName,
		onDeleteWatchlist,
		openDeleteModal,
		isPageLoading,
	]);

	return (
		<div className="mt-6">
			<Helmet>
				<title>{name ? `${name} | Watchlist` : 'Watchlist'}</title>
			</Helmet>
			{content}
			{isDeleteModalOpen && (
				<DeleteModal>
					<ModalWrapper>
						<div className="flex h-fit flex-col items-start justify-center gap-6 p-8">
							<p>
								Are you sure you want to delete <span className="font-bold">{name}</span>?
							</p>
							<div className="flex w-full flex-row justify-center gap-3">
								<Button theme="light" onClick={closeDeleteModal}>
									<span className="text-md">Cancel</span>
								</Button>
								<Button level="danger" theme="light" onClick={onDeleteWatchlist}>
									<span className="text-md">Delete</span>
								</Button>
							</div>
						</div>
					</ModalWrapper>
				</DeleteModal>
			)}
		</div>
	);
};
