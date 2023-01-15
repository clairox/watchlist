import React, { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect } from 'react';
import { useState } from 'react';
import { searchMovie } from '../services/tmdb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCirclePlus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import { useModal } from '../hooks/useModal';
import ModalWrapper from './ModalWrapper';
import Button from './Button';
import { useWatchlists } from '../context/watchlistContext';
import noImage from '../assets/no-image.png';

//////////////////////////////
// Search Bar
//////////////////////////////

type SearchProps = {
	searchBarOpen: boolean;
	setSearchBarOpen: Dispatch<SetStateAction<boolean>>;
};

export const SearchBar: React.FunctionComponent<SearchProps> = ({ searchBarOpen, setSearchBarOpen }) => {
	const PLACEHOLDER_TEXT = 'Find a movie, TV series, etc...';

	const [canShowResults, setCanShowResults] = useState(false);
	const [dataToAdd, setDataToAdd] = useState(null);
	const [searchResults, setSearchResults] = useState<{ [key: string]: any }[]>([]);
	const [searchText, setSearchText] = useState('');

	const { isOpen, openModal, closeModal, Modal } = useModal();

	const openAddToListModal = (data: any) => {
		setSearchText('');
		setDataToAdd(data);
		openModal();
	};

	const searchBar: MutableRefObject<HTMLInputElement | null> = useRef(null);
	const resultsContainer: MutableRefObject<HTMLDivElement | null> = useRef(null);

	const closeResults = () => {
		setSearchResults([]);
	};

	let searchDelayHandler: any = null;

	const searchResultsProps = {
		openAddToListModal,
		searchBarOpen,
		searchResults,
		setCanShowResults,
		closeResults,
	};

	useEffect(() => {
		document.onclick = e => {
			if (!searchBar.current || !resultsContainer.current) {
				return;
			}

			if (
				!searchBar.current.contains(e.target as HTMLElement) &&
				resultsContainer.current &&
				!resultsContainer.current.contains(e.target as HTMLElement)
			) {
				closeResults();
			}
		};
	}, []);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		clearTimeout(searchDelayHandler);
		searchDelayHandler = null;

		setSearchText(event.target.value);
	};

	const handleInputKeyUp = () => {
		clearTimeout(searchDelayHandler);
		searchDelayHandler = null;

		searchDelayHandler = setTimeout(async () => {
			if (searchText.match(/^\s*$/)) return;
			await searchMovie(searchText).then((results: { [key: string]: any }[]) => {
				setSearchResults(results);
				setCanShowResults(true);
			});
		}, 150);
	};

	const handleInputKeyDown = () => {
		if (searchText.length === 0) {
			setSearchResults([]);
		}
	};

	return (
		<>
			<div className={`flex flex-row lg:ml-10 ${searchBarOpen ? '' : 'hidden'} sm:hidden`} id="close-search-bar">
				<div className="flex items-center">
					<FontAwesomeIcon
						icon={faXmark}
						size="lg"
						className="hover:cursor-pointer"
						onClick={() => {
							setSearchBarOpen(false);
							setSearchText('');
							setSearchResults([]);
						}}
					/>
				</div>
			</div>
			<div className="ml-4 flex w-full justify-center sm:mx-10" id="search-bar-container">
				<form
					className="w-full w-full sm:max-w-md lg:max-w-full xl:max-w-2xl "
					id="search-form"
					autoComplete="off"
					onSubmit={e => e.preventDefault()}
				>
					<input
						className={`mt-[15px] w-full appearance-none rounded bg-gray-800 py-[7px] px-3 leading-tight text-gray-100 focus:bg-gray-900 focus:outline-none ${
							searchBarOpen ? '' : 'hidden'
						} sm:inline-block`}
						id="search-bar"
						type="text"
						placeholder={PLACEHOLDER_TEXT}
						value={searchText}
						ref={searchBar}
						onFocus={e => (e.target.placeholder = '')}
						onBlur={e => (e.target.placeholder = PLACEHOLDER_TEXT)}
						onChange={handleInputChange}
						onKeyUp={handleInputKeyUp}
						onKeyDown={handleInputKeyDown}
					/>
					{canShowResults && searchResults && searchText && (
						<div ref={resultsContainer}>
							<SearchResults {...searchResultsProps} />
						</div>
					)}
				</form>
			</div>

			{isOpen && (
				<Modal>
					<AddToListModal data={dataToAdd} closeModal={closeModal} />
				</Modal>
			)}
		</>
	);
};

//////////////////////////////
// Search Results
//////////////////////////////

type ResultsProps = {
	openAddToListModal: (data: any) => void;
	searchResults: { [key: string]: any }[];
	searchBarOpen: boolean;
	setCanShowResults: Dispatch<SetStateAction<boolean>>;
	closeResults: () => void;
};

const SearchResults: React.FunctionComponent<ResultsProps> = ({
	openAddToListModal,
	searchResults,
	searchBarOpen,
	setCanShowResults,
	closeResults,
}) => {
	const handleMouseDown = useCallback(
		(event: MouseEvent) => {
			const searchForm = document.getElementById('search-form');

			if (!searchForm?.contains(event.target as HTMLElement)) {
				setCanShowResults(false);
			}
		},
		[setCanShowResults]
	);

	useEffect(() => {
		window.addEventListener('mousedown', handleMouseDown);

		return () => {
			window.removeEventListener('mousedown', handleMouseDown);
		};
	}, [handleMouseDown]);

	return (
		<div
			className={`mx-auto max-h-[750px] w-full overflow-auto bg-white sm:max-w-md lg:max-w-full xl:max-w-2xl ${
				searchBarOpen ? '' : 'hidden'
			} sm:block`}
		>
			<ul>
				{searchResults.map(r => {
					return (
						<ResultsItem
							openAddToListModal={openAddToListModal}
							item={r}
							key={r.id + (r.title || r.name) + '/' + r.release_date}
							closeResults={closeResults}
						/>
					);
				})}
			</ul>
		</div>
	);
};

//////////////////////////////
// Search Result Item
//////////////////////////////

type ResultItemProps = {
	openAddToListModal: (data: any) => void;
	item: { [key: string]: any };
	closeResults: () => void;
};

const ResultsItem: React.FunctionComponent<ResultItemProps> = ({ openAddToListModal, item, closeResults }) => {
	let { id, title, name, overview, poster_path, release_date, first_air_date } = item;

	if (item.media_type === 'tv') {
		title = name;
		release_date = first_air_date;
	}
	return (
		<li>
			<div className="flex h-64 w-full flex-col items-start justify-center border-b-[1px] border-gray-100 px-5 text-black hover:cursor-default hover:border-gray-100 hover:bg-gray-100">
				<div className="flex h-[210px] flex-row">
					<div className="min-w-[77px] max-w-[140px] md:min-w-[140px]">
						{poster_path ? (
							<img
								src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${poster_path}`}
								width="140px"
								alt="movie poster"
							/>
						) : (
							<img src={noImage} width="140px" alt="movie poster" />
						)}
					</div>
					<div className="flex flex-col justify-start pl-6 text-left">
						<h1 className="h-8 text-2xl font-bold line-clamp-1">{title}</h1>
						<div className="mb-1 block">
							{release_date ? (
								<h4 className="text-md mr-2 inline-block font-bold">{release_date.slice(0, 4)}</h4>
							) : (
								<></>
							)}
							<span className="inline-block w-fit rounded-md bg-green-600 px-2 text-xs font-bold text-white">
								{item.media_type.toUpperCase()}
							</span>
						</div>
						<p className="h-[90px] text-[15px] line-clamp-4">{overview}</p>
						<div className="mt-7">
							<FontAwesomeIcon
								className="hover:cursor-pointer"
								id="add-to-list-button"
								size="2x"
								color="green"
								icon={faCirclePlus}
								onClick={e => {
									openAddToListModal({
										id,
										title,
										poster_url: poster_path
											? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${poster_path}`
											: '',
										release_date: release_date.slice(0, 4) || null,
									});
									closeResults();
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</li>
	);
};

//////////////////////////////
// Add To List Modal
//////////////////////////////

type ModalProps = {
	data: any;
	closeModal: () => void;
};

const AddToListModal: React.FunctionComponent<ModalProps> = ({ data, closeModal }) => {
	const { watchlists, watchlistLoadState, createWatchlist, addItem } = useWatchlists();

	const listSelect: MutableRefObject<HTMLSelectElement | null> = useRef(null);

	const onAddToListFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (watchlistLoadState === 'loading' || !addItem) return;

		if (!listSelect.current) return;

		if (listSelect.current.value === 'new') {
			if (!createWatchlist) return;

			const newList = await createWatchlist('', false);

			if (newList) {
				addItem(newList.id, data);
			}
		} else {
			const watchlistId = listSelect.current.value;
			addItem(watchlistId, data);
		}

		closeModal();
	};

	return (
		<ModalWrapper>
			<div className="flex h-fit items-start justify-center gap-6 p-8">
				{data.poster_url ? (
					<img
						src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${data.poster_url}`}
						width="140px"
						alt="movie poster"
					/>
				) : (
					<img src={noImage} width="140px" alt="movie poster" />
				)}
				<form className="relative bottom-[6px] flex flex-col items-start" onSubmit={onAddToListFormSubmit}>
					<h3 className="mb-4 w-fit text-2xl font-bold line-clamp-2">{data.title}</h3>
					<p className="mb-4 ">Choose a list to add to</p>
					<select
						className="max-w-96 mb-8 flex h-8 w-full flex-row rounded bg-gray-800 px-2 text-white text-black focus:outline-none sm:min-w-[288px]"
						id="lists"
						name="lists"
						ref={listSelect}
						defaultValue={watchlists?.find(l => l.default)?.id || ''}
					>
						{watchlists?.map(i => {
							return (
								<option key={i.id} value={i.id}>
									{i.default ? i.name + ' (default)' : i.name}
								</option>
							);
						})}
						<option value={'new'}>+ New watchlist</option>
					</select>
					<div className="">
						<Button type="submit" shape="square" theme="light">
							<FontAwesomeIcon className="pr-2" icon={faPlus} size="sm" />
							<span className="text-md">Add</span>
						</Button>
					</div>
				</form>
			</div>
		</ModalWrapper>
	);
};
