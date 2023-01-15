import React, { useEffect, useState, useContext, createContext } from 'react';
import { LoginData, SignupData } from '../../types';
import axios from '../lib/axiosInstance';

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
	editAccountName?: (data: { firstName: string; lastName: string }) => Promise<{ status: number }>;
	editAccountEmail?: (data: { email: string }) => Promise<{ status: number }>;
	editAccountPassword?: (data: { password: string }) => Promise<{ status: number }>;
	deleteAccount?: () => void;
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

	const login = async (loginData: LoginData) => {
		return await axios
			.post('/login', loginData, reqConfig)
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
			.post('/signup', signupData, reqConfig)
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
		return await axios.get('/logout', reqConfig).then(() => {
			setUser(null);
			localStorage.removeItem('user');
			localStorage.removeItem('watchlists');
			setIsLoading(false);
		});
	};

	const editAccountName = async (data: { firstName: string; lastName: string }): Promise<{ status: number }> => {
		return await axios
			.patch('/users/sessionUser/name', { firstname: data.firstName, lastname: data.lastName }, reqConfig)
			.then(res => {
				setUser(res.data);
				localStorage.setItem('user', res.data);
				setIsLoading(false);
				return { status: res.status };
			})
			.catch(err => {
				setIsLoading(false);
				return { status: err.response.status };
			});
	};

	const editAccountEmail = async (data: { email: string }): Promise<{ status: number }> => {
		return await axios
			.patch('/users/sessionUser/email', data, reqConfig)
			.then(res => {
				setUser(res.data);
				localStorage.setItem('user', res.data);
				setIsLoading(false);
				return { status: res.status };
			})
			.catch(err => {
				setIsLoading(false);
				return { status: err.response.status };
			});
	};

	const editAccountPassword = async (data: { password: string }): Promise<{ status: number }> => {
		return await axios
			.patch('/users/sessionUser/password', data, reqConfig)
			.then(res => {
				setUser(res.data);
				localStorage.setItem('user', res.data);
				setIsLoading(false);
				return { status: res.status };
			})
			.catch(err => {
				setIsLoading(false);
				return { status: err.response.status };
			});
	};

	const deleteAccount = async () => {
		return await axios.delete(`/users/sessionUser`, reqConfig).then(res => {
			setUser(null);
			localStorage.removeItem('user');
			localStorage.removeItem('watchlists');
			setIsLoading(false);
		});
	};

	/*const logoutIfUserDoesntExist = async () => {
		return await axios
			.get('/checkUserExists', reqConfig)
			.then(async (res) => {
				if (!res.data) {
					await logout();
				}
			});
	};*/

	const isEmailTaken = async (email: string) => {
		return await axios
			.get(`/users/exists/by?email=${email}`, reqConfig)
			.then(() => true)
			.catch(() => false);
	};

	useEffect(() => {
		axios
			.get('/users/sessionUser', { withCredentials: true })
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
	}, []);

	return {
		user,
		login,
		signup,
		logout,
		editAccountName,
		editAccountEmail,
		editAccountPassword,
		deleteAccount,
		isEmailTaken,
		isLoading,
	};
};
