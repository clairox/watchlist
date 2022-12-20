import React, { useState } from 'react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export const SignupPage = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [invalidSignupWarning, setInvalidSignupWarning] = useState(<></>);

	// Border Color Classes
	const [firstNameBCC, setFirstNameBCC] = useState('border-gray-600');
	const [lastNameBCC, setLastNameBCC] = useState('border-gray-600');
	const [emailBCC, setEmailBCC] = useState('border-gray-600');
	const [passwordBCC, setPasswordBCC] = useState('border-gray-600');

	const { user, signup, isEmailTaken } = useAuth() || {};

	const navigate = useNavigate();
	const location = useLocation();

	// @ts-ignore
	const { from } = location?.state || { from: { pathname: '/' } };

	const EMAIL_PATTERN =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

	useEffect(() => {
		if (user) {
			navigate(from);
		}
	}, [user, navigate, from]);

	return (
		<div className="mx-auto min-h-screen w-full lg:max-w-md lg:py-24">
			<form
				className="min-h-screen rounded bg-gray-700 px-8 pt-24 pb-8 shadow-sm lg:min-h-fit lg:pt-10"
				onSubmit={async e => {
					e.preventDefault();

					if (!signup || !isEmailTaken) {
						setInvalidSignupWarning(
							<div className="mb-4 w-full rounded bg-red-500 p-1 px-5 text-white shadow-sm ">
								<p>Something went wrong. Please try again.</p>
							</div>
						);
						return;
					}
					setInvalidSignupWarning(<></>);

					const warningsList = [];

					if (firstName.length < 2) {
						warningsList.push(<li key="firstNameTooShort">First name should be at least 2 characters</li>);
					}

					if (lastName.length < 2) {
						warningsList.push(<li key="lastNameTooShort">Last name should be at least 2 characters</li>);
					}

					if (EMAIL_PATTERN.test(email)) {
						const emailTaken = await isEmailTaken(email);
						if (emailTaken) {
							warningsList.push(<li key="emailUnavailable">Email is already in use</li>);
						}
					} else {
						warningsList.push(<li key="emailInvalid">Please enter a valid email</li>);
					}

					if (password.length < 8) {
						warningsList.push(<li key="passwordTooShort">Password should be at least 8 characters</li>);
					}

					//TODO: use invalid and required class
					const warning = (
						<div className="mb-4 w-full rounded bg-red-500 p-5 text-left text-white shadow-sm">
							<p className="mb-3">The following errors must be fixed before you sign up</p>
							<ul className="list-disc pl-6">
								{warningsList.map(w => {
									switch (w.key) {
										case 'firstNameTooShort':
											setFirstNameBCC('border-red-500');
											return w;
										case 'lastNameTooShort':
											setLastNameBCC('border-red-500');
											return w;
										case 'emailUnavailable':
											setEmailBCC('border-red-500');
											return w;
										case 'emailInvalid':
											setEmailBCC('border-red-500');
											return w;
										case 'passwordTooShort':
											setPasswordBCC('border-red-500');
											return w;
										default:
											return w;
									}
								})}
							</ul>
						</div>
					);

					if (warningsList.length) {
						setInvalidSignupWarning(warning);
						return;
					}

					signup({
						firstName,
						lastName,
						email,
						password,
					});
				}}
			>
				<div className="mx-auto max-w-[384px]">
					<Helmet>
						<title>Sign up</title>
					</Helmet>
					<div className="flex flex-col items-start">
						<div className="mb-7 w-full">
							<h1 className="text-4xl font-bold text-white">Sign up</h1>
						</div>
						{invalidSignupWarning}
						<div className="mb-6 flex w-full flex-row ">
							<div className="mr-4 grow">
								<input
									className={`appearance-none border-2 bg-gray-600 ${firstNameBCC} w-full rounded py-3 px-4 leading-tight text-gray-200 focus:bg-gray-500 focus:outline-none`}
									type="text"
									name="ifirst"
									id="ifirst"
									placeholder="First"
									value={firstName}
									onChange={e => {
										setFirstName(e.target.value);
										setFirstNameBCC('border-gray-600');
									}}
								/>
							</div>
							<div className="grow">
								<input
									className={`appearance-none border-2 bg-gray-600 ${lastNameBCC} w-full rounded py-3 px-4 leading-tight text-gray-200 focus:bg-gray-500 focus:outline-none`}
									type="text"
									name="ilast"
									id="ilast"
									placeholder="Last"
									value={lastName}
									onChange={e => {
										setLastName(e.target.value);
										setLastNameBCC('border-gray-600');
									}}
								/>
							</div>
						</div>
						<div className="mb-6 w-full">
							<input
								className={`appearance-none border-2 bg-gray-600 ${emailBCC} w-full rounded py-3 px-4 leading-tight text-gray-200 focus:bg-gray-500 focus:outline-none`}
								type="text"
								name="iemail"
								id="iemail"
								placeholder="Email"
								value={email}
								onChange={e => {
									setEmail(e.target.value);
									setEmailBCC('border-gray-600');
								}}
							/>
						</div>
						<div className="mb-6 w-full">
							<input
								className={`appearance-none border-2 bg-gray-600 ${passwordBCC} w-full rounded py-3 px-4 leading-tight text-gray-200 focus:bg-gray-500 focus:outline-none`}
								type="password"
								name="ipassword"
								id="ipassword"
								placeholder="Password"
								value={password}
								onChange={e => {
									setPassword(e.target.value);
									setPasswordBCC('border-gray-600');
								}}
							/>
						</div>
						<div className="mb-4 w-full">
							<button
								className="focus:shadow-outline rounded bg-gray-500 py-2 px-4 font-bold text-white hover:bg-gray-600 focus:outline-none disabled:bg-gray-500 disabled:text-gray-400 disabled:hover:bg-gray-500"
								type="submit"
								disabled={firstName === '' || lastName === '' || email === '' || password === ''}
							>
								Sign up
							</button>
						</div>
					</div>
					<div>
						<p className="text-gray-300">
							Already have an account?{' '}
							<Link to="/login" className="text-white">
								Login
							</Link>
						</p>
					</div>
				</div>
			</form>
		</div>
	);
};
