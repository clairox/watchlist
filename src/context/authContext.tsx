import axios from 'axios';
import React, { useEffect, useState, useContext, createContext } from 'react';
import { LoginData, SignupData } from '../../types';

type AuthUser = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
} | null;

type LoginResponse = {
	status: number;
};

const AuthContext = createContext<{
	user?: AuthUser;
	login?: (data: LoginData) => Promise<LoginResponse>;
	signup?: (data: SignupData) => Promise<LoginResponse>;
	logout?: () => void;
	isEmailTaken?: (email: string) => Promise<boolean>;
	isLoading?: boolean;
}>({});

type AuthProviderProps = {
	children: React.ReactNode;
};

export const ProvideAuth: React.FunctionComponent<AuthProviderProps> = ({ children }) => {
	const auth = useProvideAuth();
	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};

const useProvideAuth = () => {
	const [user, setUser] = useState<AuthUser | null>();
	const [isLoading, setIsLoading] = useState(true);

	const reqConfig = { withCredentials: true };

	const apiPath = process.env.REACT_APP_API_PATH;

	const login = async (loginData: LoginData) => {
		return await axios
			.post(`${apiPath}/login`, loginData, reqConfig)
			.then(res => {
				setUser(res.data);
				localStorage.setItem('user', res.data);
				setIsLoading(false);

				return { status: res.status };
			})
			.catch(err => {
				setUser(null);
				setIsLoading(false);

				return { status: err.response.status };
			});
	};

	const signup = async (signupData: SignupData) => {
		return await axios
			.post(`${apiPath}/signup`, signupData, reqConfig)
			.then(res => {
				setUser(res.data);
				localStorage.setItem('user', res.data);
				setIsLoading(false);
				return { status: res.status };
			})
			.catch(err => {
				setUser(null);
				setIsLoading(false);

				return { status: err.response.status };
			});
	};

	const logout = async () => {
		return await axios.get(`${apiPath}/logout`, reqConfig).then(() => {
			setUser(null);
			localStorage.removeItem('user');
			localStorage.removeItem('watchlists');
			setIsLoading(false);
		});
	};

	/*const logoutIfUserDoesntExist = async () => {
		return await axios
			.get(`${apiPath}/checkUserExists`, reqConfig)
			.then(async (res) => {
				if (!res.data) {
					await logout();
				}
			});
	};*/

	const isEmailTaken = async (email: string) => {
		return await axios
			.get(`${apiPath}/users/exists/by?email=${email}`, reqConfig)
			.then(() => true)
			.catch(() => false);
	};

	useEffect(() => {
		axios
			.get(`${apiPath}/users/sessionUser`, { withCredentials: true })
			.then(res => {
				if (res.data) {
					setUser(res.data);
					localStorage.setItem('user', res.data);
					setIsLoading(false);
				} else {
					setUser(null);
					localStorage.removeItem('user');
					setIsLoading(false);
				}
			})
			.catch(() => {
				setUser(null);
				localStorage.removeItem('user');
				setIsLoading(false);
			});
	}, [apiPath]);

	return {
		user,
		login,
		signup,
		logout,
		isEmailTaken,
		isLoading,
	};
};
