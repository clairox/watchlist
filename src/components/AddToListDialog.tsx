import axios from '../lib/axiosInstance';
import React, { MutableRefObject } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuth } from '../lib/authContext';

type Props = {
	data: { [key: string]: any };
	closeAddToListDialog: () => void;
};

export const AddToListDialog: React.FunctionComponent<Props> = ({ data, closeAddToListDialog }) => {
	const [watchlists, setWatchlists] = useState<{ [key: string]: any }[]>([]);

	const { user } = useAuth();
	const { id, title, releaseDate, posterURL } = data;

	const [isOpen, setOpen] = useState(false);

	const listSelect: MutableRefObject<HTMLSelectElement | null> = useRef(null);
	const dialog: MutableRefObject<HTMLDivElement | null> = useRef(null);

	useEffect(() => {
		axios
			.get(`/watchlists/`, { withCredentials: true })
			.then(res => {
				setWatchlists(res.data);
			})
			.catch(err => console.error(err));
	}, [user]);

	useEffect(() => {
		window.onclick = e => {
			if (!dialog.current) {
				return;
			}

			if (e.target instanceof HTMLElement && !dialog.current?.contains(e.target) && e.target.id !== 'add-to-list-button' && isOpen) {
				closeAddToListDialog();
			}
		};
		setOpen(true);
	}, [closeAddToListDialog, isOpen]);

	return (
		<div className="mx-6 h-[300px] w-full max-w-[500px] rounded-xl bg-gray-700 p-4 drop-shadow-md md:w-[500px]" ref={dialog}>
			<form
				className="flex flex-col py-12"
				onSubmit={async e => {
					e.preventDefault();

					const watchlistId = watchlists.find(i => i.name === listSelect.current?.value)?.id;

					await axios
						.put(
							`/watchlists/${watchlistId}/items/`,
							{
								id,
								title,
								releaseDate,
								posterURL,
							},
							{ withCredentials: true }
						)
						.then(() => window.location.reload())
						.catch(err => {
							if (err.response.status === 409) {
								window.location.reload();
							}
						});

					closeAddToListDialog();
				}}
			>
				<p className="mb-8 text-gray-100">Choose a list to add to</p>
				<select className="max-w-96 mx-12 mb-8 flex h-8 flex-row rounded px-2 sm:mx-auto sm:w-96 " ref={listSelect} id="lists" name="lists">
					{watchlists.map(i => {
						const name = i.name;
						const valueName = name.replace(' ', '-');
						return (
							<option key={valueName} value={name}>
								{name}
							</option>
						);
					})}
				</select>
				<button className="mx-auto rounded bg-green-500 py-2 px-4 font-bold text-white hover:bg-gray-600 focus:outline-none" type="submit">
					Add
				</button>
			</form>
		</div>
	);
};
