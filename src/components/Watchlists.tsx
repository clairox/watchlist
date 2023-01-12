import React, { useEffect, useState } from 'react';
import { WatchlistWithItems } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { WatchlistPreviewSlider } from './WatchlistPreviewSlider';
import Button from './Button';
import { useModal } from '../hooks/useModal';
import ModalWrapper from './ModalWrapper';
import { useWatchlists } from '../context/watchlistContext';

//TODO: add local watchlists to db on sign in

const Watchlists = () => {
	const { watchlists, watchlistLoadState } = useWatchlists();

	const [content, setContent] = useState(<></>);

	const {
		isOpen: isCreateModalOpen,
		openModal: openCreateModal,
		closeModal: closeCreateModal,
		Modal: CreateModal,
	} = useModal();

	// Set page content
	useEffect(() => {
		if (watchlistLoadState === 'loading' || watchlistLoadState === 'idle') return;

		if (!watchlists?.length) {
			setContent(
				<div className="mt-10">
					<h3 className="text-3xl font-bold text-gray-400">You don't have any watchlists</h3>
					<div className="mt-4">
						<NewWatchlistButton onClick={openCreateModal} />
					</div>
				</div>
			);
		} else {
			setContent(
				<div>
					<div className="flex w-full justify-end gap-4">
						<NewWatchlistButton onClick={openCreateModal} />
					</div>
					<ul>
						{watchlists.map((data: WatchlistWithItems, i) => (
							<WatchlistPreviewSlider data={data} key={data.id} />
						))}
					</ul>
				</div>
			);
		}
	}, [watchlists, watchlistLoadState, openCreateModal]);

	//TODO: make watchlist image column which is equal to the most recently added poster or a custom image

	return (
		<div>
			{content}
			{isCreateModalOpen && (
				<CreateModal>
					<ModalWrapper>
						<CreateWatchlistModal close={closeCreateModal} />
					</ModalWrapper>
				</CreateModal>
			)}
		</div>
	);
};

type ButtonProps = {
	onClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const NewWatchlistButton: React.FunctionComponent<ButtonProps> = ({ onClick }) => {
	return (
		<Button onClick={onClick}>
			<FontAwesomeIcon className="pr-2" icon={faPlus} size="1x" />
			<span className="text-lg">New</span>
		</Button>
	);
};

type CreateWatchlistProps = {
	close: () => void;
};

const CreateWatchlistModal: React.FunctionComponent<CreateWatchlistProps> = ({ close }) => {
	const [name, setName] = useState('');
	const [isDefault, setIsDefault] = useState(false);

	const { createWatchlist } = useWatchlists();

	return (
		<div className="flex h-fit flex-col items-start justify-center gap-6 p-8">
			<h2 className="mb-2 w-full text-center text-2xl font-bold">Create a watchlist</h2>
			<form
				onSubmit={e => {
					e.preventDefault();

					if (!createWatchlist) return;

					createWatchlist(name, isDefault);
					close();
				}}
			>
				<input
					className="max-w-96 mb-4 flex h-8 w-full flex-row rounded px-2 text-black sm:min-w-[288px]"
					type="text"
					value={name}
					onChange={e => setName(e.target.value)}
					placeholder="Title"
					autoFocus={true}
				/>
				<div>
					<input
						className="mr-2 mb-8 hover:cursor-pointer"
						type="checkbox"
						checked={isDefault}
						onChange={e => setIsDefault(e.target.checked)}
					/>
					<label className="hover:cursor-pointer" onClick={() => setIsDefault(!isDefault)}>
						Set as default? (This will unset current default.)
					</label>
				</div>
				<Button type="submit" theme="light">
					<FontAwesomeIcon className="pr-2" icon={faPlus} size="sm" />
					<span className="text-md">Add</span>
				</Button>
			</form>
		</div>
	);
};

export default Watchlists;
