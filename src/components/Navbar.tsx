import React, { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faMagnifyingGlass, faUser, faGear } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/authContext';
import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { useWatchlists } from '../context/watchlistContext';

type Props = {
	menuButton: MutableRefObject<HTMLDivElement | null>;
	setSideMenuOpen: Dispatch<SetStateAction<boolean>>;
	searchBarOpen: boolean;
	setSearchBarOpen: Dispatch<SetStateAction<boolean>>;
};

export const Navbar: React.FunctionComponent<Props> = ({
	menuButton,
	setSideMenuOpen,
	searchBarOpen,
	setSearchBarOpen,
}) => {
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const searchBarProps = {
		searchBarOpen: searchBarOpen,
		setSearchBarOpen: setSearchBarOpen,
	};

	const { clearWatchlists } = useWatchlists();

	const handleLoginButtonClick = () => {
		if (!user) {
			navigate('/login');
		}
	};

	const handleLogoutButtonClick = async () => {
		if (!logout || !clearWatchlists) return;

		await logout();
		clearWatchlists();
		navigate('/');
	};

	const closeUserMenu = () => {
		setUserMenuOpen(false);
	};

	return (
		<nav className="fixed z-40 h-16 w-full bg-gray-700 px-4 drop-shadow-sm">
			<div className="mx-auto flex h-full flex-row justify-between text-gray-100">
				<div
					className={`flex min-w-[91px] flex-row lg:min-w-[207px] ${searchBarOpen ? 'hidden' : ''} sm:flex`}
					id="nav-left"
				>
					{/* <div className="pr-6 leading-[56px] lg:hidden" ref={menuButton}>
						<FontAwesomeIcon
							icon={faBars}
							size="lg"
							className="hover:cursor-pointer"
							id="menu-button"
							onClick={() => setSideMenuOpen(true)}
						/>
					</div> */}
					<div className="h-full" id="brand-logo">
						<Link to="/">
							<span className="flex h-full items-center text-3xl font-bold">WL</span>
						</Link>
					</div>
					{/* <div className="ml-10 hidden flex-row leading-[60px] lg:flex" id="nav">
						<div id="nav-lists">
							<Link to="/lists">
								<p
									className="text-md h-full"
									onClick={() => setSideMenuOpen(false)}
								>
									Lists
								</p>
							</Link>
						</div>
						<div className="ml-7" id="nav-favorites">
							<Link to="/favorites">
								<p
									className="text-md h-full"
									onClick={() => setSideMenuOpen(false)}
								>
									Favorites
								</p>
							</Link>
						</div>
					</div> */}
				</div>
				<>
					<SearchBar {...searchBarProps} />
				</>

				<div
					className={`flex min-w-[150px] flex-row justify-end gap-6 sm:min-w-[91px] lg:min-w-[207px] ${
						searchBarOpen ? 'hidden' : ''
					} sm:flex`}
					id="nav-right"
				>
					<div className="flex items-center sm:hidden" id="search-button">
						<FontAwesomeIcon
							icon={faMagnifyingGlass}
							// @ts-ignore
							size="xl"
							className="hover:cursor-pointer"
							onClick={() => setSearchBarOpen(!userMenuOpen)}
						/>
					</div>

					{user ? (
						<div className="flex items-center" id="user-button-container">
							<div
								className="my-auto flex h-10 w-10 items-center rounded-full bg-gray-500 leading-[56px] hover:cursor-pointer hover:bg-gray-400"
								id="user-button"
								onClick={() => setUserMenuOpen(!userMenuOpen)}
							>
								<FontAwesomeIcon
									icon={faUser}
									// @ts-ignore
									size="lg"
									className="m-auto"
								/>
							</div>
							{userMenuOpen && (
								<UserMenu
									firstName={user?.firstName}
									logout={handleLogoutButtonClick}
									close={closeUserMenu}
								/>
							)}
						</div>
					) : (
						<div
							className="my-auto flex flex-row items-center rounded border-[1px] border-white py-1 px-2 text-lg font-bold hover:cursor-pointer hover:bg-gray-600"
							onClick={handleLoginButtonClick}
						>
							Log In
						</div>
						// <div className="leading-[56px]" id="logout-button">
						// 	<FontAwesomeIcon
						// 		icon={faRightFromBracket}
						// 		// @ts-ignore
						// 		size="xl"
						// 		className="hover:cursor-pointer"
						// 		onClick={handleLogoutButtonClick}
						// 	/>
						// </div>
					)}
				</div>
			</div>
		</nav>
	);
};

type UserMenuProps = {
	firstName: string;
	logout: () => void;
	close: () => void;
};

const UserMenu: React.FunctionComponent<UserMenuProps> = ({ firstName, logout, close }) => {
	const handleMouseDown = useCallback(
		(event: MouseEvent) => {
			const userButtonContainer = document.getElementById('user-button-container');

			if (!userButtonContainer?.contains(event.target as HTMLElement)) {
				close();
			}
		},
		[close]
	);

	useEffect(() => {
		window.addEventListener('mousedown', handleMouseDown);

		return () => {
			window.removeEventListener('mousedown', handleMouseDown);
		};
	}, [handleMouseDown]);

	const navigate = useNavigate();

	const onSettingsClicked = () => {
		navigate('/settings');
		close();
	};

	return (
		<div className="absolute top-[56px] right-[10px] w-52 rounded bg-gray-700 py-4 text-left shadow-lg shadow-gray-900">
			<div className="flex h-8 items-center px-4 pb-2">
				<h4 className="truncate text-xl font-bold">{firstName}</h4>
			</div>
			<div
				className="flex h-12 items-center pl-4 hover:cursor-pointer hover:bg-gray-600"
				onClick={onSettingsClicked}
			>
				<FontAwesomeIcon
					icon={faGear}
					// @ts-ignore
					size="lg"
					className="mr-3"
				/>
				<p>Settings</p>
			</div>
			{/* <div className="flex h-12 h-8 items-center pl-4 hover:cursor-pointer hover:bg-gray-600">
				<FontAwesomeIcon
					icon={faCircleHalfStroke}
					// @ts-ignore
					size="lg"
					className="mr-3"
				/>
				<p>Light Mode</p>
			</div> */}
			<div className="flex h-12 h-8 items-center pl-4 hover:cursor-pointer hover:bg-gray-600" onClick={logout}>
				<FontAwesomeIcon
					icon={faRightFromBracket}
					// @ts-ignore
					size="lg"
					className="mr-3"
				/>
				<p>Log Out</p>
			</div>
		</div>
	);
};
