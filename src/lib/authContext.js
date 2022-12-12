import axios from "axios";
import { useEffect, useState, useContext, createContext } from "react";

const authContext = createContext();

export const ProvideAuth = ({ children }) => {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
	return useContext(authContext);
};

const useProvideAuth = () => {
	const [user, setUser] = useState(localStorage.getItem("user"));

	const reqConfig = { withCredentials: true };

	const apiPath = process.env.REACT_APP_API_PATH;

	const login = async (loginData) => {
		return await axios
			.post(`${apiPath}/login`, loginData, reqConfig)
			.then((res) => {
				setUser(res.data);
				localStorage.setItem("user", res.data);
				return { status: res.status };
			})
			.catch((err) => {
				setUser(null);
				return { status: err.response.status };
			});
	};

	const signup = async (signupData) => {
		return await axios
			.post(`${apiPath}/signup`, signupData, reqConfig)
			.then((res) => {
				setUser(res.data);
				localStorage.setItem("user", res.data);
				return { status: res.status };
			})
			.catch((err) => {
				setUser(null);
				return { status: err.response.status };
			});
	};

	const logout = async () => {
		return await axios.get(`${apiPath}/logout`, reqConfig).then(() => {
			setUser(null);
			localStorage.removeItem("user");
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

	const isEmailTaken = async (email) => {
		return await axios
			.get(`${apiPath}/users/exists/by?email=${email}`, reqConfig)
			.then(() => true)
			.catch(() => false);
	};

	useEffect(() => {
		axios
			.get(`${apiPath}/users/sessionUser`, { withCredentials: true })
			.then((res) => {
				if (res.data) {
					setUser(res.data);
					localStorage.setItem("user", res.data);
				} else {
					setUser(null);
					localStorage.removeItem("user");
				}
			})
			.catch(() => {
				setUser(null);
				localStorage.removeItem("user");
			});
	}, [apiPath]);

	return {
		user,
		login,
		signup,
		logout,
		isEmailTaken,
	};
};
