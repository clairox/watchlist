import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/authContext";

export const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [invalidLoginWarning, setInvalidLoginWarning] = useState(<></>);

	const navigate = useNavigate();
	const location = useLocation();

	const { user, login } = useAuth() || {};

	const { from } = location?.state || { from: { pathname: "/" } };

	useEffect(() => {
		if (user) {
			navigate(from);
		}
	}, [user, navigate, from]);

	// form pt-10 pb-8
	return (
		<div className="mx-auto min-h-screen w-full lg:max-w-md lg:py-24">
			<form
				className="min-h-screen rounded bg-gray-700 px-8 pt-24 pb-8 shadow-sm lg:min-h-fit lg:pt-10"
				onSubmit={(e) => {
					e.preventDefault();
					setInvalidLoginWarning();

					login({ email, password }).then((res) => {
						if (res.status === 401) {
							setInvalidLoginWarning(
								<div className="mb-4 w-full rounded bg-red-500 p-1 px-5 text-white shadow-sm ">
									<p>
										Email or password incorrect. Please try
										again.
									</p>
								</div>
							);
						}
					});
				}}
			>
				<div className="mx-auto max-w-[384px]">
					<div className="flex flex-col items-start">
						<div className="mb-7 w-full">
							<h1 className="text-4xl font-bold text-white">
								Log in
							</h1>
						</div>
						{invalidLoginWarning}
						<div className="mb-6 w-full">
							<input
								className="w-full appearance-none rounded border-2 border-gray-600 bg-gray-600 py-3 px-4 leading-tight text-gray-200 focus:border-gray-500 focus:bg-gray-500 focus:outline-none"
								type="text"
								name="iemail"
								id="iemail"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="mb-6 w-full">
							<input
								className="w-full appearance-none rounded border-2 border-gray-600 bg-gray-600 py-3 px-4 leading-tight text-gray-200 focus:border-gray-500 focus:bg-gray-500 focus:outline-none"
								type="password"
								name="ipassword"
								id="ipassword"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className="mb-4 w-full">
							<button
								className="focus:shadow-outline rounded bg-gray-500 py-2 px-4 font-bold text-white hover:bg-gray-600 focus:outline-none disabled:bg-gray-500 disabled:text-gray-400 disabled:hover:bg-gray-500"
								type="submit"
								disabled={email === "" || password === ""}
							>
								Login
							</button>
						</div>
					</div>
					<div>
						<p className="text-gray-300">
							New user?{" "}
							<Link to="/signup" className="text-white">
								Create an account
							</Link>
						</p>
					</div>
				</div>
			</form>
		</div>
	);
};
