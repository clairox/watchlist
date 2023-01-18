import React, { MutableRefObject, useCallback, useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { faAngleLeft, faAngleRight, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { Watchlist, WatchlistItem } from '../../types';
import { useWatchlists } from '../context/watchlistContext';
import add from '../assets/add.png';
import MobileDetect from 'mobile-detect';

type SliderItem = WatchlistItem & {
	sliderItemId?: string;
	hidden?: boolean;
};

//////////////////////////////
// Slider
//////////////////////////////

type Slider = {
	data: Watchlist;
	setSearchBarOpen: Dispatch<SetStateAction<boolean>>;
};

export const WatchlistPreviewSlider: React.FunctionComponent<Slider> = ({ data, setSearchBarOpen }) => {
	const { watchlists } = useWatchlists();

	const [watchlistItems, setWatchlistItems] = useState<SliderItem[]>([]);
	const [count, setCount] = useState(0);
	const [moveLeftHTML, setMoveLeftHTML] = useState(<></>);
	const [moveRightHTML, setMoveRightHTML] = useState(<></>);
	const [moving, setMoving] = useState(false);

	type DeviceType = 'computer' | 'mobile' | '';
	const [deviceType, setDeviceType] = useState<DeviceType>('');

	const watchlistId = data.id;
	const watchlistName = data.name;

	type WindowWidth = 4 | 6 | 7 | 9 | 10;

	const calculateWindowWidth = useCallback((): WindowWidth => {
		const w = window.innerWidth;
		if (w < 768) {
			return 4;
		}
		if (w < 1024) {
			return 6;
		}
		if (w < 1280) {
			return 7;
		}
		if (w < 1536) {
			return 9;
		}
		return 10;
	}, []);

	//TODO: add feature to move to different list
	const [numberOfItemSections, setNumberOfItemSections] = useState(calculateWindowWidth());

	const scrollableContainer: MutableRefObject<HTMLDivElement | null> = useRef(null);

	const MAX_ITEM_COUNT = 30;

	const onMouseEnterSlider = () => {
		if (deviceType !== 'computer') return;
		setMoveLeftHTML(
			<span className="absolute left-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-r from-black to-transparent hover:cursor-pointer">
				<FontAwesomeIcon size="lg" icon={faAngleLeft} color="white" />
			</span>
		);
		setMoveRightHTML(
			<span className="absolute right-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-r from-transparent to-black hover:cursor-pointer">
				<FontAwesomeIcon size="lg" icon={faAngleRight} color="white" />
			</span>
		);
	};

	const onMouseLeaveSlider = () => {
		setMoveLeftHTML(<></>);
		setMoveRightHTML(<></>);
	};

	//TODO: make placeholder if images don't show or are loading or something
	//TODO: make slider wrap
	const getSliderItemIndex = (item: SliderItem) => parseInt(item.sliderItemId!.split('-')[2]);

	const isDisplayableItem = (item: SliderItem) => !isNaN(parseInt(item.sliderItemId!.split('-')[2]));

	const prepareItemsForDisplay = (items: SliderItem[]) => {
		items = items.map((item: SliderItem) => {
			if (isDisplayableItem(item)) {
				item.hidden = false;
			}
			return item;
		});

		return items;
	};

	const moveLeft = () => {
		if (moving) return;

		setMoving(true);

		const indexOfFirstNumberedSliderItem = watchlistItems.findIndex(item => getSliderItemIndex(item) === 0);

		if (indexOfFirstNumberedSliderItem === 0) {
			setMoving(false);
			return;
		}

		const indexOfLastNumberedSliderItem = watchlistItems.findIndex(
			item => getSliderItemIndex(item) === numberOfItemSections - 1
		);

		const itemsLeft = indexOfFirstNumberedSliderItem;
		const moveBy = itemsLeft > numberOfItemSections ? numberOfItemSections : itemsLeft;

		let newWatchlistItems = cloneDeep(watchlistItems);

		// For each numbered slider-item- Move index to item that is moveBy behind in watchlist
		for (let i = indexOfFirstNumberedSliderItem; i <= indexOfLastNumberedSliderItem; i++) {
			let currentWatchlistItem = newWatchlistItems[i];
			let watchlistItemToMoveTo = newWatchlistItems[i - moveBy];
			const sid = currentWatchlistItem.sliderItemId;

			currentWatchlistItem.sliderItemId = 'slider-item-';
			watchlistItemToMoveTo.sliderItemId = sid;
		}

		// Predisplay next items for smooth translate transition
		newWatchlistItems = prepareItemsForDisplay(newWatchlistItems);

		setWatchlistItems(newWatchlistItems);
	};

	const moveRight = () => {
		if (moving) return;

		setMoving(true);
		const indexOfLastNumberedSliderItem = watchlistItems.findIndex(
			item => getSliderItemIndex(item) === numberOfItemSections - 1
		);

		if (indexOfLastNumberedSliderItem === watchlistItems.length - 1) {
			setMoving(false);
			return;
		}

		const indexOfFirstNumberedSliderItem = watchlistItems.findIndex(item => getSliderItemIndex(item) === 0);

		const itemsLeft = watchlistItems.length - 1 - indexOfLastNumberedSliderItem;
		const moveBy = itemsLeft > numberOfItemSections ? numberOfItemSections : itemsLeft;

		let newWatchlistItems = cloneDeep(watchlistItems);

		// For each numbered slider-item- Move index to item that is moveBy ahead in watchlist
		for (let i = indexOfLastNumberedSliderItem; i >= indexOfFirstNumberedSliderItem; i--) {
			let currentWatchlistItem = newWatchlistItems[i];
			let watchlistItemToMoveTo = newWatchlistItems[i + moveBy];
			const sid = currentWatchlistItem.sliderItemId;

			currentWatchlistItem.sliderItemId = 'slider-item-';
			watchlistItemToMoveTo.sliderItemId = sid;
		}

		// Predisplay next items for smooth translate transition
		newWatchlistItems = prepareItemsForDisplay(newWatchlistItems);

		setWatchlistItems(newWatchlistItems);
	};

	useEffect(() => {
		const readyToTranslateLeft = (items: SliderItem[]) => {
			const indexOfLastNumberedSliderItem = watchlistItems.findIndex(
				item => getSliderItemIndex(item) === numberOfItemSections - 1
			);

			const moveBy = items.filter(item => !item.hidden && !isDisplayableItem(item)).length;

			if (moveBy <= 0) {
				return false;
			}

			for (let i = indexOfLastNumberedSliderItem + 1; i <= indexOfLastNumberedSliderItem + moveBy; i++) {
				if (!items[i] || items[i].hidden) {
					return false;
				}
			}
			return true;
		};

		const readyToTranslateRight = (items: SliderItem[]) => {
			const indexOfFirstNumberedSliderItem = watchlistItems.findIndex(item => getSliderItemIndex(item) === 0);

			const moveBy = items.filter(item => !item.hidden && !isDisplayableItem(item)).length;

			if (moveBy <= 0) {
				return false;
			}

			for (let i = indexOfFirstNumberedSliderItem - 1; i >= indexOfFirstNumberedSliderItem - moveBy; i--) {
				if (!items[i] || items[i].hidden) {
					return false;
				}
			}
			return true;
		};

		const hidePreviousItems = (items: SliderItem[]) => {
			const newItems = cloneDeep(items).map(item => {
				if (!item.hidden && !isDisplayableItem(item)) {
					item.hidden = true;
				}
				return item;
			});

			setWatchlistItems(newItems);
		};

		const sc = scrollableContainer.current;

		if (!sc) return;

		if (readyToTranslateLeft(watchlistItems)) {
			const moveBy = watchlistItems.filter(item => !item.hidden && !isDisplayableItem(item)).length;
			const percentageToTranslateBy = (moveBy / numberOfItemSections) * 100;

			sc.style.transform = `translate(-${percentageToTranslateBy}%, 0)`;
			setTimeout(() => {
				sc.style.transition = 'transform 0.5s ease-out';
				sc.style.transform = `translate(0%, 0)`;
			}, 1);

			setTimeout(() => {
				sc.style.transition = '';
				hidePreviousItems(watchlistItems);
				setMoving(false);
			}, 510);
		} else if (readyToTranslateRight(watchlistItems)) {
			const moveBy = watchlistItems.filter(item => !item.hidden && !isDisplayableItem(item)).length;
			const percentageToTranslateBy = (moveBy / numberOfItemSections) * 100;

			sc.style.transition = 'transform 0.5s ease-out';
			sc.style.transform = `translate(-${percentageToTranslateBy}%, 0)`;

			setTimeout(() => {
				sc.style.transition = '';
				hidePreviousItems(watchlistItems);
				setMoving(false);
			}, 510);
		} else {
			sc.style.transform = `translate(0%, 0)`;
		}
	}, [watchlistItems, numberOfItemSections, watchlistName]);

	//TODO: add comments
	useEffect(() => {
		if (!watchlistItems.length) {
			return;
		}

		const getDeviceType = () => {
			let hasTouchScreen = false;
			if ('maxTouchPoints' in navigator) {
				hasTouchScreen = navigator.maxTouchPoints > 0;
			} else if ('msMaxTouchPoints' in navigator) {
				hasTouchScreen = navigator['msMaxTouchPoints'] > 0;
			} else {
				let mQ = matchMedia('(pointer:coarse)');
				if (mQ && mQ.media === '(pointer:coarse)') {
					hasTouchScreen = !!mQ.matches;
				} else if ('orientation' in window) {
					hasTouchScreen = true;
				}
			}

			const md = new MobileDetect(window.navigator.userAgent);
			const isMobileDetected = md.mobile() || md.phone() || md.tablet();

			if (hasTouchScreen || isMobileDetected) {
				setWatchlistItems(
					watchlistItems.map((item, i) => {
						return {
							...item,
							sliderItemId: 'slider-item-' + i,
							hidden: false,
						};
					})
				);

				return 'mobile';
			} else {
				return 'computer';
			}
		};

		if (deviceType === '') {
			setDeviceType(getDeviceType());
		}

		const changeElementIdsByVisibility = (newSections: WindowWidth) => {
			const newItems = cloneDeep(watchlistItems);
			let startIndex = 0;
			let itemsLeft = 0;

			if (newItems.length > newSections) {
				const siIndex = newItems.findIndex(item => item.sliderItemId === 'slider-item-0');

				itemsLeft = watchlistItems.length - siIndex;
				startIndex = itemsLeft >= newSections ? siIndex : newItems.length - newSections;
			}
			if (getDeviceType() !== 'computer') return;

			for (let i = 0; i < newItems.length; i++) {
				newItems[i].sliderItemId = 'slider-item-';
				newItems[i].hidden = true;
			}

			for (let i = startIndex; i <= startIndex + (newSections - 1); i++) {
				if (i >= newItems.length) {
					break;
				}
				newItems[i].sliderItemId = 'slider-item-' + (i - startIndex);
				newItems[i].hidden = false;
			}

			setWatchlistItems(newItems);
		};

		const onResize = () => {
			const newSections = calculateWindowWidth();
			if (newSections !== numberOfItemSections) {
				changeElementIdsByVisibility(newSections);
				setNumberOfItemSections(newSections);
				window.removeEventListener('resize', onResize);
			}
		};

		window.addEventListener('resize', onResize);
	}, [numberOfItemSections, watchlistItems, watchlistName, calculateWindowWidth, deviceType]);

	useEffect(() => {
		const items = watchlists?.find(l => l.id === watchlistId)?.items;
		if (!items) return;

		const slicedItems = items.slice(0, MAX_ITEM_COUNT);
		setWatchlistItems(
			slicedItems?.map((item: any, i: number) => {
				const newItem = {
					...item,
					sliderItemId: 'slider-item-' + (deviceType !== 'mobile' ? (i < numberOfItemSections ? i : '') : i),
				};

				newItem.hidden = deviceType !== 'mobile' ? !isDisplayableItem(newItem) : false;
				return newItem;
			})
		);

		setCount(items.length);
	}, [numberOfItemSections, watchlistId, watchlists, deviceType]);

	return (
		<div className="mb-4">
			<div className="w-full px-4 pb-3 text-left">
				{data.default ? (
					<div className="relative bottom-[2px] mr-3 inline-block text-gray-100">
						<FontAwesomeIcon icon={faLock} size="sm" />
					</div>
				) : (
					<></>
				)}
				<h2 className="mr-3 inline-block text-2xl font-bold text-gray-100 hover:cursor-pointer hover:underline">
					<Link to={`/lists/${watchlistId}`}>{watchlistName}</Link>
				</h2>
				<span className="inline-block text-lg font-bold text-gray-400">{count}</span>
			</div>
			<div
				className="slider relative z-0 select-none"
				onMouseEnter={onMouseEnterSlider}
				onMouseLeave={onMouseLeaveSlider}
			>
				{watchlistItems.length ? (
					<>
						<div id="moveLeft" onClick={moveLeft}>
							{moveLeftHTML}
						</div>
						<div id="moveRight" onClick={moveRight}>
							{moveRightHTML}
						</div>
						<ul className="no-scrollbar overflow-x-scroll whitespace-nowrap leading-[0]">
							<div className="text-left" ref={scrollableContainer}>
								{watchlistItems.map((data, i) => (
									<WatchlistPreviewItem data={data} id={data.sliderItemId!} key={data.id} />
								))}
							</div>
						</ul>
					</>
				) : (
					<div className="text-left">
						<li className="inline-block flex w-[25%] items-center justify-center bg-transparent px-1 text-white  md:w-[16.6666666%] lg:w-[14.2857143%] xl:w-[11.1111111%] 2xl:w-[10%]">
							<img
								className="w-fit rounded-lg opacity-50 hover:cursor-pointer hover:opacity-100"
								src={add}
								alt="movie poster"
								onClick={async () => {
									const searchBar = document.getElementById('search-bar') as HTMLInputElement;
									await setSearchBarOpen(true);
									searchBar?.focus();
								}}
							/>
						</li>
					</div>
				)}
			</div>
		</div>
	);
};

type ItemProps = {
	data: SliderItem;
	id: string;
};

//////////////////////////////
// Slider Item
//////////////////////////////

const WatchlistPreviewItem = React.memo<ItemProps>(({ data, id }) => {
	let { poster_url, hidden } = data;

	return (
		<li
			id={id}
			className={`${
				hidden ? '' : 'inline-block'
			} w-[25%] px-1 text-white md:w-[16.6666666%] lg:w-[14.2857143%] xl:w-[11.1111111%] 2xl:w-[10%]`}
		>
			{hidden ? (
				<></>
			) : (
				<img
					className="w-fit rounded-lg bg-gray-500"
					src={`https://image.tmdb.org/t/xTranslation/w600_and_h900_bestv2${poster_url}`}
					alt="movie poster"
				/>
			)}
		</li>
	);
});
//TODO: get scroll bar back
