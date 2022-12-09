import React, { useEffect } from "react";
import { useState } from "react";
import { searchMovie } from "../lib/tmdb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";

const ResultsItem = ({ item, openAddToListDialog, closeResults }) => {
	let {
		id,
		title,
		name,
		overview,
		poster_path,
		release_date,
		first_air_date,
	} = item;
	if (item.media_type === "tv") {
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
							<div className="flex h-full w-full items-center justify-center bg-gray-200">
								<p className="px-2 text-3xl font-bold text-gray-600">
									No Image
								</p>
							</div>
						)}
					</div>
					<div className="flex flex-col justify-start pl-6 text-left">
						<h1 className="h-8 text-2xl font-bold line-clamp-1">
							{title}
						</h1>
						<div className="mb-1 block">
							{release_date ? (
								<h4 className="text-md mr-2 inline-block font-bold">
									{release_date.slice(0, 4)}
								</h4>
							) : (
								<></>
							)}
							<span className="inline-block w-fit rounded-md bg-green-600 px-2 text-xs font-bold text-white">
								{item.media_type.toUpperCase()}
							</span>
						</div>
						<p className="h-[90px] text-[15px] line-clamp-4">
							{overview}
						</p>
						<div className="mt-7">
							<FontAwesomeIcon
								className="hover:cursor-pointer"
								id="add-to-list-button"
								size="2xl"
								color="green"
								icon={faCirclePlus}
								onClick={(e) => {
									openAddToListDialog({
										id,
										title,
										posterURL: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${poster_path}`,
										releaseDate:
											release_date.slice(0, 4) || null,
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

const SearchResults = ({
	searchResults,
	searchBarOpen,
	openAddToListDialog,
	closeResults,
}) => {
	return (
		<div
			className={`mx-auto max-h-[750px] w-full overflow-auto bg-white sm:max-w-md lg:max-w-full xl:max-w-2xl ${
				searchBarOpen ? "" : "hidden"
			} sm:block`}
		>
			<ul>
				{searchResults.map((r) => {
					return (
						<ResultsItem
							item={r}
							key={
								r.id +
								(r.title || r.name) +
								"/" +
								r.release_date
							}
							openAddToListDialog={openAddToListDialog}
							closeResults={closeResults}
						/>
					);
				})}
			</ul>
		</div>
	);
};

export const SearchBar = ({
	searchBarOpen,
	setSearchBarOpen,
	openAddToListDialog,
}) => {
	const [searchText, setSearchText] = useState("");
	const [searchResults, setSearchResults] = useState({});
	const [canShowResults, setCanShowResults] = useState(false);

	const searchBar = useRef(null);
	const resultsContainer = useRef(null);

	const closeResults = () => {
		setSearchResults(null);
	};

	let searchDelayHandler = null;

	const searchResultsProps = {
		searchBarOpen: searchBarOpen,
		searchResults: searchResults,
		openAddToListDialog: openAddToListDialog,
		closeResults: closeResults,
	};

	useEffect(() => {
		document.onclick = (e) => {
			if (!searchBar.current || !resultsContainer.current) {
				return;
			}

			if (
				!searchBar.current.contains(e.target) &&
				resultsContainer.current &&
				!resultsContainer.current.contains(e.target)
			) {
				closeResults(false);
			}
		};
	}, []);

	return (
		<>
			<div
				className={`ml-4 flex flex-row lg:ml-10 ${
					searchBarOpen ? "" : "hidden"
				} sm:hidden`}
				id="close-search-bar"
			>
				<div className="leading-[56px]">
					<FontAwesomeIcon
						icon={faXmark}
						size="xl"
						className="hover:cursor-pointer"
						onClick={() => {
							setSearchBarOpen(false);
							setSearchText("");
							setSearchResults(null);
						}}
					/>
				</div>
			</div>
			<div className="mx-4 w-full sm:mx-10" id="search-bar">
				<form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
					<input
						className={`mt-2.5 w-full appearance-none rounded bg-gray-800 py-[7px] px-3 leading-tight text-gray-100 focus:outline-none sm:max-w-md lg:max-w-full xl:max-w-2xl ${
							searchBarOpen ? "" : "hidden"
						} sm:inline-block`}
						type="text"
						placeholder="Find a movie, TV series, etc..."
						value={searchText}
						ref={searchBar}
						onChange={(e) => {
							clearTimeout(searchDelayHandler);
							searchDelayHandler = null;

							setSearchText(e.target.value);
						}}
						onKeyUp={(e) => {
							clearTimeout(searchDelayHandler);
							searchDelayHandler = null;

							searchDelayHandler = setTimeout(async () => {
								if (searchText.match(/^\s*$/)) return;
								await searchMovie(searchText).then(
									(results) => {
										console.log(results);
										setSearchResults(results);
										setCanShowResults(true);
									}
								);
							}, 150);
						}}
						onKeyDown={(e) => {
							if (searchText.length === 0) {
								setSearchResults(null);
							}
						}}
					/>
					{canShowResults && searchResults && searchText && (
						<div ref={resultsContainer}>
							<SearchResults
								{...searchResultsProps}
								onBlur={() => setCanShowResults(false)}
							/>
						</div>
					)}
				</form>
			</div>
		</>
	);
};
