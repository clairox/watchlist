import React, { MutableRefObject, useRef, useState, Dispatch, SetStateAction } from 'react';
import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

type Props = {
	searchBarOpen: boolean;
	setSearchBarOpen: Dispatch<SetStateAction<boolean>>;
};

export const Layout: React.FunctionComponent<Props> = ({ searchBarOpen, setSearchBarOpen }) => {
	const [sideMenuOpen, setSideMenuOpen] = useState(false);

	const sideMenu: MutableRefObject<HTMLDivElement | null> = useRef(null);
	const menuButton: MutableRefObject<HTMLDivElement | null> = useRef(null);

	useEffect(() => {
		window.onclick = e => {
			if (!sideMenu.current || !menuButton.current) {
				return;
			}

			if (
				!sideMenu.current.contains(e.target as HTMLElement) &&
				!menuButton.current.contains(e.target as HTMLElement)
			) {
				setSideMenuOpen(false);
			}
		};
	}, []);

	//TODO: clicking off dialog window shouldn't click other things
	return (
		<div>
			<div>
				{sideMenuOpen && <div className="fixed z-50 h-full w-full bg-black opacity-30 lg:hidden" />}
				<div>
					<Navbar {...{ menuButton, setSideMenuOpen, searchBarOpen, setSearchBarOpen }} />
				</div>
				<div className="px-4 pt-20">
					<Outlet />
				</div>
			</div>
			<nav
				className={`fixed top-0 left-0 z-50 h-full w-72 transform overflow-auto bg-gray-700 text-gray-100 drop-shadow-lg transition-all duration-300 ease-in-out lg:hidden ${
					sideMenuOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
				ref={sideMenu}
			>
				<div className="flex flex-col">
					<div>
						<FontAwesomeIcon
							icon={faXmark}
							size="lg"
							className="float-right mr-5 mt-3 hover:cursor-pointer"
							onClick={() => setSideMenuOpen(false)}
						/>
					</div>
					<div className="mt-4">
						<ul className="text-left text-[17px]">
							<li>
								<Link to="/lists">
									<div
										className="h-[46px] border-b-[1px] border-gray-500 pl-5 leading-[45px] hover:cursor-pointer hover:border-inherit"
										onClick={() => setSideMenuOpen(false)}
									>
										Lists
									</div>
								</Link>
							</li>
							<li>
								<Link to="/favorites">
									<div
										className="h-[46px] border-b-[1px] border-gray-500 pl-5 leading-[45px] hover:cursor-pointer hover:border-inherit"
										onClick={() => setSideMenuOpen(false)}
									>
										Favorites
									</div>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
};
