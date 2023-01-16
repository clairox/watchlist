import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import Button from '../components/Button';
import ModalWrapper from '../components/ModalWrapper';
import { useAuth } from '../context/authContext';
import { useWatchlists } from '../context/watchlistContext';
import { useModal } from '../hooks/useModal';

export const SettingsPage: React.FunctionComponent = () => {
	const { user, deleteAccount, isEmailTaken, editAccountName, editAccountEmail, editAccountPassword } = useAuth();
	const navigate = useNavigate();
	const { clearWatchlists } = useWatchlists();

	const EditModal = useModal();
	const [editModalInnerHTML, setEditModalInnerHTML] = useState(<></>);

	const onEditNameClicked = async () => {
		await setEditModalInnerHTML(
			<EditAccountModal
				{...{
					label: 'Name',
					close: EditModal.closeModal,
					inputs: [
						{ label: 'First', type: 'text', required: true },
						{ label: 'Last', type: 'text', required: true },
					],
					onEditClicked: async (data: { label: string; text: string; required: boolean }[]) => {
						const first = data[0].text;
						const last = data[1].text;

						if (first.length < 1) {
							return { status: 'failed', message: 'First name should be at least 1 character' };
						}

						if (last.length < 1) {
							return { status: 'failed', message: 'Last name should be at least 1 character' };
						}

						if (!editAccountName) {
							return { status: 'failed', message: 'Something went wrong. Please try again.' };
						}

						const res = await editAccountName({ firstName: first, lastName: last });
						return res.status === 200
							? { status: 'succeeded' }
							: { status: 'failed', message: 'Something went wrong. Please try again.' };
					},
				}}
			/>
		);
		EditModal.openModal();
	};

	const onEditEmailClicked = async () => {
		await setEditModalInnerHTML(
			<EditAccountModal
				{...{
					label: 'Email',
					close: EditModal.closeModal,
					inputs: [{ label: 'Email', type: 'email', required: true }],
					onEditClicked: async (data: { label: string; text: string; required: boolean }[]) => {
						const email = data[0].text;
						const EMAIL_PATTERN =
							/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

						if (!EMAIL_PATTERN.test(email)) {
							return { status: 'failed', message: 'Please enter a valid email' };
						}

						if (!isEmailTaken)
							return { status: 'failed', message: 'Something went wrong. Please try again.' };

						const emailTaken = await isEmailTaken(email);
						if (emailTaken) {
							return { status: 'failed', message: 'Email is already in use' };
						}

						if (!editAccountEmail) {
							return { status: 'failed', message: 'Something went wrong. Please try again.' };
						}

						const res = await editAccountEmail({ email });
						return res.status === 200
							? { status: 'succeeded' }
							: { status: 'failed', message: 'Something went wrong. Please try again.' };
					},
				}}
			/>
		);
		EditModal.openModal();
	};

	const onEditPasswordClicked = async () => {
		await setEditModalInnerHTML(
			<EditAccountModal
				{...{
					label: 'Password',
					close: EditModal.closeModal,
					inputs: [{ label: 'Password', type: 'password', required: true }],
					onEditClicked: async (data: { label: string; text: string; required: boolean }[]) => {
						const password = data[0].text;

						if (password.length < 8) {
							return { status: 'failed', message: 'Password should be at least 8 characters' };
						}

						if (!editAccountPassword) {
							return { status: 'failed', message: 'Something went wrong. Please try again.' };
						}

						const res = await editAccountPassword({ password });
						return res.status === 200
							? { status: 'succeeded' }
							: { status: 'failed', message: 'Something went wrong. Please try again.' };
					},
				}}
			/>
		);
		EditModal.openModal();
	};

	const DeleteModal = useModal();

	const onDelete = async () => {
		if (!deleteAccount || !clearWatchlists) return;

		DeleteModal.closeModal();
		await deleteAccount();
		clearWatchlists();
		navigate('/');
	};

	return (
		<div className="mt-10 flex w-full justify-center px-4 sm:p-0">
			<Helmet>
				<title>Settings</title>
			</Helmet>
			<div className="w-[600px] text-white">
				<h2 className="mb-4 text-3xl font-bold">Account</h2>
				<div className="flex flex-col gap-4">
					<div className="rounded-md bg-gray-700">
						<div className="flex h-12 items-center border-b-[1px] border-gray-800 px-4 sm:px-6">
							<div className="basis-1/3 text-left sm:basis-1/6">Name:</div>
							<div className="basis-3/6 truncate text-left sm:basis-2/3">
								{user?.firstName + ' ' + user?.lastName}
							</div>
							<div className="basis-1/6 text-right sm:basis-1/6">
								<button className="hover:text-gray-300" onClick={onEditNameClicked}>
									Edit
								</button>
							</div>
						</div>

						<div className="flex h-12 items-center border-b-[1px] border-gray-800 px-4 sm:px-6">
							<div className="basis-1/3 text-left sm:basis-1/6">Email:</div>
							<div className="basis-3/6 truncate text-left sm:basis-2/3">{user?.email}</div>
							<div className="basis-1/6 text-right sm:basis-1/6">
								<button className="hover:text-gray-300" onClick={onEditEmailClicked}>
									Edit
								</button>
							</div>
						</div>

						<div className="flex h-12 items-center border-b-[1px] border-gray-800 px-4 sm:px-6">
							<div className="basis-1/3 text-left sm:basis-1/6">Password:</div>
							<div className="basis-3/6 truncate text-left sm:basis-2/3">********</div>
							<div className="basis-1/6 text-right sm:basis-1/6">
								<button className="hover:text-gray-300" onClick={onEditPasswordClicked}>
									Edit
								</button>
							</div>
						</div>
					</div>
					<div className="rounded-md bg-gray-700">
						<div className="flex h-12 items-center border-b-[1px] border-gray-800 px-4 sm:px-6">
							<div className="basis-2/3 text-left">Delete Account</div>
							<div className="basis-1/3  text-right">
								<button
									className="rounded bg-red-600 py-1 px-2 hover:cursor-pointer hover:bg-red-700"
									onClick={DeleteModal.openModal}
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			{DeleteModal.isOpen && (
				<DeleteModal.Modal>
					<DeleteAccountModal close={DeleteModal.closeModal} onDelete={onDelete} />
				</DeleteModal.Modal>
			)}
			{EditModal.isOpen && <EditModal.Modal>{editModalInnerHTML}</EditModal.Modal>}
		</div>
	);
};

type EditModalProps = {
	label: string;
	close: () => void;
	onEditClicked: (data: { label: string; text: string; required: boolean }[]) => Promise<{
		status: 'succeeded' | 'failed';
		message?: string;
	}>;
	inputs: {
		label: string;
		type: 'text' | 'email' | 'password';
		required: boolean;
	}[];
};

const EditAccountModal: React.FunctionComponent<EditModalProps> = ({ label, close, onEditClicked, inputs }) => {
	const [changes, setChanges] = useState(Object.fromEntries(new Map(inputs.map(input => [input.label, '']))));
	const [invalidDataWarning, setInvalidDataWarning] = useState('');
	const [borderStyle, setBorderStyle] = useState('');

	return (
		<ModalWrapper>
			<div className="h-fit items-start justify-center p-8 sm:w-[500px]">
				<h3 className="mb-4 text-2xl font-bold">
					Edit {label[0].toUpperCase() + label.slice(1).toLowerCase()}
				</h3>
				<div>
					<form
						noValidate={true}
						onSubmit={async e => {
							e.preventDefault();
							setBorderStyle('');
							setInvalidDataWarning('');

							const res = await onEditClicked(
								inputs.map(input => {
									return {
										label: input.label,
										text: changes[input.label],
										required: true,
									};
								})
							);

							if (res.status === 'failed') {
								setBorderStyle('border-[1px] border-red-600');
								setInvalidDataWarning(res.message || '');
							} else if (res.status === 'succeeded') {
								setBorderStyle('');
								setInvalidDataWarning('');
								close();
							}
						}}
					>
						{invalidDataWarning.length > 0 && (
							<div className="mb-4 w-full rounded bg-red-600 p-1 px-5 text-white shadow-sm ">
								<p>{invalidDataWarning}</p>
							</div>
						)}
						<div className={`mb-8 w-full gap-4 ${inputs.length > 1 && 'grid grid-cols-1 sm:grid-cols-2'}`}>
							{inputs.map((input, idx) => (
								<input
									className={`${borderStyle} w-full appearance-none rounded bg-gray-800 py-2 px-4 leading-tight text-gray-200 focus:bg-gray-900 focus:outline-none`}
									id={input.label.toLowerCase() + '-input'}
									key={input.label}
									type={input.type}
									value={changes[input.label]}
									autoFocus={idx === 0}
									onChange={e => {
										const c = structuredClone(changes);
										c[input.label] = e.target.value;
										setChanges(c);
									}}
									placeholder={input.label}
								/>
							))}
						</div>
						<div className="flex w-full justify-center gap-4">
							<Button theme="light" shape="square" level="cancel" type="button" onClick={close}>
								<span className="text-md">Cancel</span>
							</Button>
							<Button theme="light" shape="square" type="submit">
								<span className="text-md">Confirm</span>
							</Button>
						</div>
					</form>
				</div>
			</div>
		</ModalWrapper>
	);
};

type DeleteModalProps = {
	close: () => void;
	onDelete: () => void;
};

const DeleteAccountModal: React.FunctionComponent<DeleteModalProps> = ({ close, onDelete }) => {
	return (
		<ModalWrapper>
			<div className="flex h-fit max-w-[500px] flex-col items-start justify-center gap-6 sm:p-8">
				<div className="px-8 pt-8 sm:p-0">
					<p>
						Are you sure you want to delete your account?{' '}
						<span className="font-bold">(Theres no going back from this!)</span>
					</p>
				</div>
				<div className="flex w-full justify-center gap-4 pb-8 sm:p-0">
					<Button theme="light" shape="square" level="cancel" onClick={close}>
						<span className="text-md">Cancel</span>
					</Button>
					<Button level="danger" shape="square" theme="red" onClick={onDelete}>
						<span className="text-md">Confirm Delete</span>
					</Button>
				</div>
			</div>
		</ModalWrapper>
	);
};
