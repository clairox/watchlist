import React, { useRef, useState } from "react";
import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AddToListDialog } from "./AddToListDialog";
import { useEffect } from "react";

export const Layout = () => {
	const [sideMenuOpen, setSideMenuOpen] = useState(false);
	const [addToListDialog, setAddToListDialog] = useState(null);

	const sideMenu = useRef(null);
	const menuButton = useRef(null);

	const openAddToListDialog = (data) => {
		setAddToListDialog(
			<div className="absolute z-50 mx-auto mt-32 flex w-full justify-center">
				<AddToListDialog
					data={data}
					closeAddToListDialog={closeAddToListDialog}
				/>
			</div>
		);
	};

	const closeAddToListDialog = () => {
		setAddToListDialog(null);
	};

	useEffect(() => {
		window.onclick = (e) => {
			if (!sideMenu.current || !menuButton.current) {
				return;
			}

			if (
				!sideMenu.current.contains(e.target) &&
				!menuButton.current.contains(e.target)
			) {
				setSideMenuOpen(false);
			}
		};
	}, []);

	//TODO: clicking off dialog window shouldn't click other things
	return (
		<div>
			{addToListDialog}
			<div>
				{sideMenuOpen && (
					<div className="fixed z-50 h-full w-full bg-black opacity-30 lg:hidden" />
				)}
				<div>
					<Navbar
						menuButton={menuButton}
						setSideMenuOpen={setSideMenuOpen}
						openAddToListDialog={openAddToListDialog}
					/>
				</div>
				<div className="pt-14">
					<Outlet />
				</div>
			</div>
			<nav
				className={`fixed top-0 left-0 z-50 h-full w-72 transform overflow-auto bg-gray-700 text-gray-100 drop-shadow-lg transition-all duration-300 ease-in-out lg:hidden ${
					sideMenuOpen ? "translate-x-0" : "-translate-x-full"
				}`}
				ref={sideMenu}
			>
				<div className="flex flex-col">
					<div>
						<FontAwesomeIcon
							icon={faXmark}
							size="xl"
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
